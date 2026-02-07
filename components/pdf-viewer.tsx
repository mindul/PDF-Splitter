'use client';

import { useEffect, useState, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface PDFViewerProps {
  file: File;
  selectedPages: Set<number>;
  onTogglePage: (pageIndex: number, isMultiSelect: boolean) => void;
}

export function PDFViewer({ file, selectedPages, onTogglePage }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [pdfJs, setPdfJs] = useState<any>(null);

  useEffect(() => {
    const initPdfJs = async () => {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      setPdfJs(pdfjsLib);
    };

    initPdfJs();
  }, []);

  useEffect(() => {
    if (!pdfJs) return;

    const loadPDF = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfJs.getDocument(arrayBuffer).promise;
        setNumPages(pdf.numPages);
      } catch (error) {
        console.error('Error loading PDF:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [file, pdfJs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {Array.from({ length: numPages }, (_, i) => (
        <PageThumbnail
          key={i}
          pageIndex={i + 1} // 1-based index for display
          file={file}
          isSelected={selectedPages.has(i + 1)}
          onClick={(e) => onTogglePage(i + 1, e.shiftKey)}
          pdfJs={pdfJs}
        />
      ))}
    </div>
  );
}

interface PageThumbnailProps {
  pageIndex: number;
  file: File;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  pdfJs: any;
}

function PageThumbnail({ pageIndex, file, isSelected, onClick, pdfJs }: PageThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const renderPage = async () => {
      if (!canvasRef.current || !pdfJs) return;

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfJs.getDocument(arrayBuffer).promise;
        const page = await pdf.getPage(pageIndex);

        if (!mounted) return;

        // Calculate scale to fit width (assuming standard aspect ratio roughly)
        const viewport = page.getViewport({ scale: 1 });
        const scale = 300 / viewport.width; // Target width 300px
        const scaledViewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
        }).promise;
        
        setLoaded(true);
      } catch (err) {
        console.error(`Error rendering page ${pageIndex}`, err);
      }
    };

    renderPage();

    return () => {
      mounted = false;
    };
  }, [file, pageIndex, pdfJs]);

  return (
    <div
      onClick={onClick}
      className={`
        relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-200 hover:border-blue-300'}
      `}
    >
      <div className="aspect-[1/1.4] bg-gray-100 flex items-center justify-center relative">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
        <canvas ref={canvasRef} className="w-full h-full object-contain" />
        
        {/* Overlay for selection state and hover */}
        <div className={`
          absolute inset-0 transition-colors
          ${isSelected ? 'bg-blue-500/10' : 'group-hover:bg-black/5'}
        `} />
        
        {/* Page Number Badge */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
          {pageIndex}
        </div>

        {/* Selection Checkmark */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-0.5 shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
