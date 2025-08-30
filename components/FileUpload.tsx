
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './IconComponents';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const dragDropClasses = isDragging
    ? 'border-purple-400 bg-purple-900/30 scale-105'
    : 'border-gray-600 hover:border-purple-500 bg-gray-800/50';

  return (
    <div className="text-center flex flex-col items-center justify-center h-full animate-fade-in">
      <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-4">
        MP3 to AI Slideshow
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10">
        Transform your music into a stunning AI-generated slideshow that evolves with every beat and title.
      </p>
      <label
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full max-w-2xl h-64 border-2 border-dashed ${dragDropClasses} rounded-2xl cursor-pointer transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon />
          <p className="mb-2 text-sm text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">MP3 audio file</p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" accept=".mp3" onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default FileUpload;
