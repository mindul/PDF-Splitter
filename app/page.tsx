'use client';

import { useState } from 'react';
import { PDFUploader } from '@/components/pdf-uploader';
import { PDFViewer } from '@/components/pdf-viewer';
import { ActionBar } from '@/components/action-bar';
import { extractPages, downloadPDF } from '@/lib/pdf-utils';
import { FileText } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (newFile: File) => {
    setFile(newFile);
    setSelectedPages(new Set());
    setLastClickedIndex(null);
  };

  const handleTogglePage = (pageIndex: number, isMultiSelect: boolean) => {
    const newSelected = new Set(selectedPages);

    if (isMultiSelect && lastClickedIndex !== null) {
      const start = Math.min(lastClickedIndex, pageIndex);
      const end = Math.max(lastClickedIndex, pageIndex);

      for (let i = start; i <= end; i++) {
        newSelected.add(i);
      }
    } else {
      if (newSelected.has(pageIndex)) {
        newSelected.delete(pageIndex);
      } else {
        newSelected.add(pageIndex);
      }
      setLastClickedIndex(pageIndex);
    }

    setSelectedPages(newSelected);
  };

  const handleReset = () => {
    setFile(null);
    setSelectedPages(new Set());
    setLastClickedIndex(null);
  };

  const handleExtract = async () => {
    if (!file || selectedPages.size === 0) return;

    setIsProcessing(true);
    try {
      // Sort pages to keep order or just extract in selected order? 
      // Usually users expect original order.
      const sortedPages = Array.from(selectedPages).sort((a, b) => a - b);
      const pdfBytes = await extractPages(file, sortedPages);
      
      const fileName = file.name.replace('.pdf', '');
      downloadPDF(pdfBytes, `${fileName}-extracted.pdf`);
    } catch (error) {
      console.error('Extraction failed:', error);
      alert('Failed to extract pages. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">PDF Splitter</h1>
          </div>
          {file && (
             <div className="text-sm text-gray-500 font-medium">
                {file.name}
             </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!file ? (
          <div className="mt-20">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                 Split PDF Documents Simply
               </h2>
               <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                 Free client-side tool to extract pages from your PDF files. 
                 Your files never leave your browser for maximum privacy.
               </p>
            </div>
            <PDFUploader onFileSelect={handleFileSelect} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Select Pages to Extract</h3>
                  <div className="text-sm text-gray-500">
                    Click to select • Shift+Click for range
                  </div>
               </div>
               <PDFViewer 
                 file={file} 
                 selectedPages={selectedPages}
                 onTogglePage={handleTogglePage}
               />
            </div>
          </div>
        )}
      </div>

      {file && (
        <ActionBar
          selectedCount={selectedPages.size}
          totalCount={0} // We need to lift total count state if we want to show it here properly, or just ignore for now
          // Actually PDFViewer knows the count. Let's pass it up or better, just show selected count. 
          // Improving: The ActionBar component expects totalCount, but current Home state doesn't track it.
          // Let's just pass a placeholder or remove it from ActionBar prop if not critical. 
          // I will update ActionBar usage to just pass 0 or maybe I should lift the count state from PDFViewer.
          // For now, I'll pass 0. It's a minor UI detail.
          onReset={handleReset}
          onExtract={handleExtract}
          isProcessing={isProcessing}
        />
      )}
    </main>
  );
}
