
import React, { useState, useEffect, useRef } from 'react';
import type { SlideshowImage } from '../types';
import { PlayIcon, PauseIcon, RestartIcon, ExportIcon } from './IconComponents';

interface SlideshowProps {
  images: SlideshowImage[];
  mp3Url: string;
  onRestart: () => void;
}

const Slideshow: React.FC<SlideshowProps> = ({ images, mp3Url, onRestart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showExportMessage, setShowExportMessage] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    
    if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }

    return () => clearInterval(interval);
  }, [images.length]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleExport = () => {
      setShowExportMessage(true);
      setTimeout(() => setShowExportMessage(false), 3000);
  };

  const currentImage = images[currentIndex];
  const nextIndex = (currentIndex + 1) % images.length;
  const nextImage = images[nextIndex];

  return (
    <div className="relative w-full h-screen max-h-[80vh] aspect-video rounded-2xl overflow-hidden shadow-2xl border border-purple-900/50 bg-black animate-fade-in">
        {images.map((image, index) => (
            <img
                key={index}
                src={image.url}
                alt={image.prompt}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
            />
        ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div className="bg-black/50 backdrop-blur-md p-4 rounded-lg">
            <p className="text-lg font-semibold text-gray-200">AI Prompt:</p>
            <p className="text-xl italic text-gray-100 transition-opacity duration-500">{currentImage?.prompt}</p>
        </div>
      </div>

      <div className="absolute top-4 right-4 flex space-x-2">
        <button onClick={handleExport} className="p-3 bg-black/50 rounded-full hover:bg-purple-600 transition-colors">
            <ExportIcon />
        </button>
        <button onClick={onRestart} className="p-3 bg-black/50 rounded-full hover:bg-purple-600 transition-colors">
            <RestartIcon />
        </button>
        <button onClick={togglePlayPause} className="p-3 bg-black/50 rounded-full hover:bg-purple-600 transition-colors">
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

       {showExportMessage && (
        <div className="absolute top-20 right-4 bg-green-500/80 text-white py-2 px-4 rounded-lg animate-fade-in-down">
          Video export has started! (Simulation)
        </div>
      )}

      <audio ref={audioRef} src={mp3Url} loop onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
    </div>
  );
};

export default Slideshow;
