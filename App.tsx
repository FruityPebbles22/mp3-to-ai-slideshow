import React, { useState, useCallback } from 'react';
import { AppState, StyleOption, SlideshowImage } from './types';
import FileUpload from './components/FileUpload';
import StyleSelector from './components/StyleSelector';
import LoadingScreen from './components/LoadingScreen';
import Slideshow from './components/Slideshow';
import { generateImagePrompts } from './services/geminiService';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [mp3File, setMp3File] = useState<File | null>(null);
  const [songTitle, setSongTitle] = useState<string>('');
  const [slideshowImages, setSlideshowImages] = useState<SlideshowImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mp3Url, setMp3Url] = useState<string>('');

  const handleFileSelect = (file: File) => {
    setMp3File(file);
    const title = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, ' ');
    setSongTitle(title);
    setMp3Url(URL.createObjectURL(file));
    setAppState(AppState.CONFIGURING);
    setError(null);
  };

  const handleGenerate = useCallback(async (title: string, style: StyleOption) => {
    setAppState(AppState.GENERATING);
    setError(null);
    try {
      const prompts = await generateImagePrompts(title, style);
      if (prompts.length === 0) {
        throw new Error("AI failed to generate prompts. Please try a different title or style.");
      }
      
      const images: SlideshowImage[] = prompts.map((prompt) => {
        let enhancedPrompt = `${prompt}, ${style} style, high quality, masterpiece`;
        if (style === 'Furry') {
          enhancedPrompt += ', SFW, safe-for-work, wholesome';
        }
        const encodedPrompt = encodeURIComponent(enhancedPrompt);
        return {
          url: `https://image.pollinations.ai/prompt/${encodedPrompt}`,
          prompt: prompt,
        };
      });
      setSlideshowImages(images);
      setAppState(AppState.PLAYING);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate slideshow. ${errorMessage}`);
      setAppState(AppState.CONFIGURING);
    }
  }, []);

  const handleRestart = () => {
    if (mp3Url) {
      URL.revokeObjectURL(mp3Url);
    }
    setAppState(AppState.IDLE);
    setMp3File(null);
    setSongTitle('');
    setSlideshowImages([]);
    setError(null);
    setMp3Url('');
  };
  
  const renderContent = () => {
    switch (appState) {
      case AppState.IDLE:
        return <FileUpload onFileSelect={handleFileSelect} />;
      case AppState.CONFIGURING:
        return (
          <StyleSelector
            initialTitle={songTitle}
            onGenerate={handleGenerate}
            error={error}
            onBack={handleRestart}
          />
        );
      case AppState.GENERATING:
        return <LoadingScreen />;
      case AppState.PLAYING:
        return <Slideshow images={slideshowImages} mp3Url={mp3Url} onRestart={handleRestart} />;
      default:
        return <FileUpload onFileSelect={handleFileSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-gray-900 to-purple-900/40 -z-10"></div>
      <div className="w-full max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
}