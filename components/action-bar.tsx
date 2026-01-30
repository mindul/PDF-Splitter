'use client';

import { Download, RotateCcw, Split } from 'lucide-react';

interface ActionBarProps {
  selectedCount: number;
  totalCount: number;
  onReset: () => void;
  onExtract: () => void;
  isProcessing: boolean;
}

export function ActionBar({ 
  selectedCount, 
  totalCount, 
  onReset, 
  onExtract,
  isProcessing 
}: ActionBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onReset}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start Over</span>
          </button>
          <div className="h-6 w-px bg-gray-200" />
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{selectedCount}</span> of {totalCount} pages selected
          </p>
        </div>

        <button
          onClick={onExtract}
          disabled={selectedCount === 0 || isProcessing}
          className={`
            flex items-center space-x-2 px-6 py-2.5 rounded-lg text-white font-medium shadow-sm transition-all
            ${
              selectedCount === 0 || isProcessing
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:scale-95'
            }
          `}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Split className="w-4 h-4" />
              <span>Extract PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
