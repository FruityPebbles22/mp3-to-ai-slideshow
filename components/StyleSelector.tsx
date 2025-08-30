
import React, { useState } from 'react';
import { StyleOption, StyleOptions } from '../types';

interface StyleSelectorProps {
  initialTitle: string;
  onGenerate: (title: string, style: StyleOption) => void;
  onBack: () => void;
  error: string | null;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ initialTitle, onGenerate, onBack, error }) => {
  const [title, setTitle] = useState(initialTitle);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null);

  const handleGenerateClick = () => {
    if (title && selectedStyle) {
      onGenerate(title, selectedStyle);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-gray-800/50 rounded-2xl shadow-2xl border border-gray-700 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
          Customize Your Slideshow
        </h2>
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-white transition-colors">
            &larr; Start Over
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="mb-8">
        <label htmlFor="songTitle" className="block text-lg font-medium text-gray-300 mb-2">
          Song Title
        </label>
        <input
          id="songTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-900/70 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
          placeholder="Enter the title of your song..."
        />
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-300 mb-4">Choose a Visual Style</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {StyleOptions.map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`py-4 px-2 text-center rounded-lg border-2 transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-400
                ${selectedStyle === style ? 'bg-purple-600 border-purple-400 shadow-lg' : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'}`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleGenerateClick}
        disabled={!title || !selectedStyle}
        className="w-full py-4 text-xl font-bold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
      >
        Generate Slideshow
      </button>
    </div>
  );
};

export default StyleSelector;
