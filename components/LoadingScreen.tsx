
import React, { useState, useEffect } from 'react';
import { GENERATING_MESSAGES } from '../constants';

const LoadingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % GENERATING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
      <p className="mt-8 text-xl text-gray-300 transition-opacity duration-500">
        {GENERATING_MESSAGES[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingScreen;
