
import React, { useState, useEffect } from 'react';
import { FileJson, Loader2, PlayCircle, StopCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Transaction } from '../types/Transaction';
import { simulateJSONFileLoading } from '../utils/helpers';

interface FileLoaderProps {
  onDataLoaded: (transaction: Transaction) => void;
}

const FileLoader: React.FC<FileLoaderProps> = ({ onDataLoaded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileCount, setFileCount] = useState(0);
  const [simulator, setSimulator] = useState<{ start: () => void; stop: () => void } | null>(null);

  useEffect(() => {
    // Initialize the simulator
    const sim = simulateJSONFileLoading((data) => {
      onDataLoaded(data);
      setFileCount(prev => prev + 1);
    });
    
    setSimulator(sim);
    
    return () => {
      // Clean up when component unmounts
      if (simulator) {
        simulator.stop();
      }
    };
  }, [onDataLoaded]);

  const toggleSimulation = () => {
    if (!simulator) return;

    if (isLoading) {
      simulator.stop();
      setIsLoading(false);
    } else {
      simulator.start();
      setIsLoading(true);
    }
  };

  return (
    <motion.div 
      className="glass rounded-xl p-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <FileJson className="h-5 w-5 mr-2 text-unionbank-blue" />
            JSON File Loader
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {fileCount} files processed
          </p>
        </div>
        
        <motion.button
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            isLoading 
              ? 'bg-unionbank-red text-white' 
              : 'bg-unionbank-blue text-white'
          }`}
          onClick={toggleSimulation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!simulator}
        >
          {isLoading ? (
            <>
              <StopCircle className="h-5 w-5" />
              <span>Stop Loading</span>
            </>
          ) : (
            <>
              <PlayCircle className="h-5 w-5" />
              <span>Start Loading</span>
            </>
          )}
        </motion.button>
      </div>
      
      {isLoading && (
        <div className="mt-4 bg-black/5 rounded-lg p-3 flex items-center">
          <Loader2 className="h-5 w-5 text-unionbank-blue animate-spin mr-2" />
          <span className="text-sm">Loading transactions... (2 second interval)</span>
        </div>
      )}
    </motion.div>
  );
};

export default FileLoader;
