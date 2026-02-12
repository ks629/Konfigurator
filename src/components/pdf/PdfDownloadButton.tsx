'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { generateOfferPdfBlob, type PdfOfferData } from '@/lib/pdf-generator';

interface PdfDownloadButtonProps {
  data: PdfOfferData;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  label?: string;
}

export function PdfDownloadButton({
  data,
  className,
  variant = 'default',
  size = 'lg',
  label = 'Pobierz ofertę PDF',
}: PdfDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      // Generuj PDF (dynamiczny import aby zmniejszyć bundle)
      const blob = generateOfferPdfBlob(data);

      // Stwórz link do pobrania
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Oferta-Nexbe-${data.product.capacity_kwh}kWh-${data.product.brand}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Błąd generowania PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isGenerating}
      variant={variant}
      size={size}
      className={className}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generowanie...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4 mr-2" />
          {label}
        </>
      )}
    </Button>
  );
}
