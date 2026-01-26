import { PDFDocument } from 'pdf-lib';

export async function extractPages(file: File, selectedPages: number[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer);
  const newDoc = await PDFDocument.create();

  // selectedPages are 1-based, pdf-lib uses 0-based
  const indices = selectedPages.map(p => p - 1);
  const copiedPages = await newDoc.copyPages(srcDoc, indices);

  copiedPages.forEach(page => {
    newDoc.addPage(page);
  });

  return await newDoc.save();
}

export function downloadPDF(data: Uint8Array, filename: string) {
  const blob = new Blob([data], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
