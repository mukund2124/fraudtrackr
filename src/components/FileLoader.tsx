
import React, { useState, useEffect, useRef } from 'react';
import { FileJson, Loader2, PlayCircle, StopCircle, FolderUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Transaction } from '../types/Transaction';
import { simulateJSONFileLoading } from '../utils/helpers';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface FileLoaderProps {
  onDataLoaded: (transaction: Transaction) => void;
}

const FileLoader: React.FC<FileLoaderProps> = ({ onDataLoaded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileCount, setFileCount] = useState(0);
  const [simulator, setSimulator] = useState<{ start: () => void; stop: () => void } | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processingState, setProcessingState] = useState('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Initialize the simulator with 0.5 second interval instead of 2 seconds
    const sim = simulateJSONFileLoading((data) => {
      onDataLoaded(data);
      setFileCount(prev => prev + 1);
    }, 500); // Changed from 2000 to 500 milliseconds
    
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

  const handleFolderUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const jsonFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].name.endsWith('.json')) {
        jsonFiles.push(files[i]);
      }
    }
    
    if (jsonFiles.length === 0) {
      toast({
        title: "No JSON files found",
        description: "Please select a folder containing JSON files",
        variant: "destructive"
      });
      return;
    }
    
    setUploadedFiles(jsonFiles);
    toast({
      title: "Files ready",
      description: `${jsonFiles.length} JSON files ready to process`
    });
  };

  const processUploadedFiles = () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No files to process",
        description: "Please upload JSON files first",
        variant: "destructive"
      });
      return;
    }
    
    if (processingState === 'processing') {
      setProcessingState('idle');
      return;
    }
    
    setProcessingState('processing');
    setFileCount(0);
    
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < uploadedFiles.length) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonData = JSON.parse(e.target?.result as string);
            onDataLoaded(jsonData as Transaction);
            setFileCount(prev => prev + 1);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            toast({
              title: "Error processing file",
              description: `Could not parse ${uploadedFiles[index].name}`,
              variant: "destructive"
            });
          }
        };
        reader.readAsText(uploadedFiles[index]);
        index++;
      } else {
        clearInterval(intervalId);
        setProcessingState('idle');
        toast({
          title: "Processing complete",
          description: `Processed ${fileCount} JSON files successfully`
        });
      }
    }, 500); // Changed from 2000 to 500 milliseconds
    
    // Store intervalId for cleanup
    return () => clearInterval(intervalId);
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
          <p className="text-sm text-gray-500 mt-1">
            {fileCount} files processed
          </p>
        </div>
        
        <div className="flex space-x-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileInputChange} 
            style={{ display: 'none' }} 
            webkitdirectory="" 
            directory=""
            multiple
          />
          
          <Button
            variant="outline"
            onClick={handleFolderUpload}
            className="bg-white text-unionbank-blue border-unionbank-blue hover:bg-unionbank-blue hover:text-white"
          >
            <FolderUp className="h-5 w-5 mr-2" />
            Upload Folder
          </Button>
          
          {uploadedFiles.length > 0 && (
            <Button
              variant={processingState === 'processing' ? 'destructive' : 'default'}
              onClick={processUploadedFiles}
              className={processingState === 'processing' ? 'bg-unionbank-red' : 'bg-unionbank-blue'}
            >
              {processingState === 'processing' ? (
                <>
                  <StopCircle className="h-5 w-5 mr-2" />
                  Stop Processing
                </>
              ) : (
                <>
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Process Files
                </>
              )}
            </Button>
          )}
          
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
                <span>Stop Demo</span>
              </>
            ) : (
              <>
                <PlayCircle className="h-5 w-5" />
                <span>Start Demo</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
      
      {isLoading && (
        <div className="mt-4 bg-black/5 rounded-lg p-3 flex items-center">
          <Loader2 className="h-5 w-5 text-unionbank-blue animate-spin mr-2" />
          <span className="text-sm">Loading demo transactions... (0.5 second interval)</span>
        </div>
      )}
      
      {processingState === 'processing' && (
        <div className="mt-4 bg-black/5 rounded-lg p-3 flex items-center">
          <Loader2 className="h-5 w-5 text-unionbank-blue animate-spin mr-2" />
          <span className="text-sm">Processing uploaded files... (0.5 second interval)</span>
        </div>
      )}
      
      {uploadedFiles.length > 0 && processingState === 'idle' && (
        <div className="mt-4 bg-black/5 rounded-lg p-3">
          <p className="text-sm font-medium mb-1">{uploadedFiles.length} JSON files ready to process</p>
          <p className="text-xs text-gray-500">Click "Process Files" to start processing them one by one</p>
        </div>
      )}
    </motion.div>
  );
};

export default FileLoader;
