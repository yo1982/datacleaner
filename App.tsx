
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataTable } from './components/DataTable';
import { cleanDataWithGemini } from './services/geminiService';

// Smaller components defined in the main App file for simplicity

const Header: React.FC = () => (
  <header className="text-center p-6 border-b border-slate-700">
    <h1 className="text-4xl font-bold text-white">AI Data Cleaner</h1>
    <p className="text-lg text-slate-400 mt-2">
      Upload your messy CSV, and let AI do the hard work.
    </p>
  </header>
);

const Loader: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-slate-850 rounded-lg p-4">
    <svg className="animate-spin h-10 w-10 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="text-white mt-4 text-lg">{message}</p>
  </div>
);

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.415-.772 1.736 0l1.291 3.118c.22.529.714.883 1.28.944l3.437.5c1.02.148 1.42 1.408.693 2.122l-2.488 2.426c-.4.389-.586 1.002-.497 1.595l.587 3.42c.178 1.034-.896 1.823-1.823 1.34l-3.075-1.616c-.51-.268-1.12-.268-1.63 0l-3.075 1.616c-.927.483-2.001-.306-1.823-1.34l.587-3.42c.09-.593-.097-1.206-.497-1.595L1.44 9.568c-.727-.714-.327-1.974.693-2.122l3.437-.5c.566-.06.106-.415 1.28-.944l1.29-3.118Z" clipRule="evenodd" />
  </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
    <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
  </svg>
);


// Simple CSV Parser
const parseCSV = (csvText: string): string[][] => {
  if (!csvText.trim()) return [];
  return csvText.trim().split('\n').map(row => row.split(','));
};


export default function App() {
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [rawCSV, setRawCSV] = useState<string>('');
  const [cleanedCSV, setCleanedCSV] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const rawData = parseCSV(rawCSV);
  const cleanedData = parseCSV(cleanedCSV);

  const handleFileSelect = (file: File) => {
    setRawFile(file);
    setCleanedCSV('');
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setRawCSV(text);
    };
    reader.onerror = () => {
        setError("Failed to read the file.");
        setRawCSV('');
    }
    reader.readAsText(file);
  };

  const handleCleanData = useCallback(async () => {
    if (!rawCSV) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await cleanDataWithGemini(rawCSV);
      setCleanedCSV(result);
    } catch (e) {
      console.error(e);
      setError('An error occurred while cleaning the data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [rawCSV]);

  const handleDownload = () => {
    if (!cleanedCSV || !rawFile) return;
    const blob = new Blob([cleanedCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const originalFilename = rawFile.name.substring(0, rawFile.name.lastIndexOf('.'));
    link.setAttribute('download', `${originalFilename}_cleaned.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Panel */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-white">1. Original Data</h2>
            <FileUpload onFileSelect={handleFileSelect} currentFile={rawFile} />
            <div className="bg-slate-850 rounded-lg shadow-lg overflow-hidden flex-grow">
               <DataTable data={rawData} title="Raw Data Preview"/>
            </div>
          </div>
          
          {/* Right Panel */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-white">2. Cleaned Data</h2>
            <div className="bg-slate-800 p-4 rounded-lg flex items-center justify-between">
              <p className="text-slate-300">Let AI process and refine your dataset.</p>
              <button
                onClick={handleCleanData}
                disabled={!rawFile || isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
              >
                <SparklesIcon className="h-5 w-5"/>
                Clean with AI
              </button>
            </div>
            <div className="bg-slate-850 rounded-lg shadow-lg overflow-hidden flex-grow">
                {isLoading ? (
                    <Loader message="AI is cleaning your data..." />
                ) : error ? (
                    <div className="flex items-center justify-center h-full min-h-[300px] text-red-400 p-4 text-center">{error}</div>
                ) : (
                    <DataTable data={cleanedData} title="Cleaned Data Preview" />
                )}
            </div>
             {cleanedData.length > 0 && !isLoading && (
                 <button
                    onClick={handleDownload}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                >
                    <DownloadIcon className="h-5 w-5"/>
                    Download Cleaned CSV
                </button>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}
