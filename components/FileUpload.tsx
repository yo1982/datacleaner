
import React, { useCallback, useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  currentFile: File | null;
}

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M9.965 2.026a.75.75 0 0 1 .557.225l4.25 4.5a.75.75 0 0 1-1.28.948L10.5 4.024V14a.75.75 0 0 1-1.5 0V4.024l-2.992 3.175a.75.75 0 1 1-1.28-.948l4.25-4.5a.75.75 0 0 1 .727-.225ZM3 13.25a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
        <path d="M4 18a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9a.75.75 0 0 1 1.5 0v9a3.5 3.5 0 0 1-3.5 3.5H6A3.5 3.5 0 0 1 2.5 18V9a.75.75 0 0 1 1.5 0v9Z" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
    </svg>
);

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, currentFile }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={`relative flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-lg transition-colors ${
        isDragging ? 'border-sky-400 bg-sky-900/20' : 'border-slate-600 hover:border-slate-500'
      }`}
    >
      <input
        type="file"
        id="file-upload"
        className="absolute w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
        accept=".csv,text/csv"
      />
      <label htmlFor="file-upload" className="flex flex-col items-center text-center cursor-pointer">
        {currentFile ? (
            <>
                <CheckIcon className="h-12 w-12 text-green-400 mb-2"/>
                <span className="font-semibold text-green-300">File Selected</span>
                <span className="text-slate-400 mt-1">{currentFile.name}</span>
            </>
        ) : (
            <>
                <UploadIcon className="h-12 w-12 text-slate-500 mb-2" />
                <span className="font-semibold text-sky-400">Click to upload or drag and drop</span>
                <span className="text-slate-400 mt-1">CSV files only</span>
            </>
        )}
      </label>
    </div>
  );
};
