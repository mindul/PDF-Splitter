'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';

interface PDFUploaderProps {
  onFileSelect: (file: File) => void;
}

export function PDFUploader({ onFileSelect }: PDFUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        flex flex-col items-center justify-center w-full max-w-2xl mx-auto 
        p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
        ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-4 bg-white rounded-full shadow-sm">
          {isDragActive ? (
            <FileText className="w-10 h-10 text-blue-500" />
          ) : (
            <Upload className="w-10 h-10 text-gray-400" />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-gray-700">
            {isDragActive ? 'Drop the PDF here' : 'Click or drag PDF here'}
          </p>
          <p className="text-sm text-gray-500">Only PDF files are supported</p>
        </div>
      </div>
    </div>
  );
}
