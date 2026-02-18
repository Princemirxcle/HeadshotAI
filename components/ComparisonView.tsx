import React from 'react';
import { DownloadIcon } from './Icons';
import { Button } from './Button';

interface ComparisonViewProps {
  originalUrl: string;
  generatedUrl: string | null;
  isLoading: boolean;
  isPro: boolean;
}

function addWatermark(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;

      ctx.drawImage(img, 0, 0);

      const text = 'ProHeadshotAI — Upgrade to Pro';
      const fontSize = Math.max(Math.floor(img.width / 18), 24);
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
      ctx.textAlign = 'center';

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 5);
      const step = canvas.height / 3;
      for (let y = -canvas.height; y < canvas.height; y += step) {
        ctx.fillText(text, 0, y);
      }
      ctx.restore();

      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.src = dataUrl;
  });
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ originalUrl, generatedUrl, isLoading, isPro }) => {

  const handleDownload = async () => {
    if (!generatedUrl) return;
    const url = isPro ? generatedUrl : await addWatermark(generatedUrl);
    const ext = isPro ? 'png' : 'jpg';
    const link = document.createElement('a');
    link.href = url;
    link.download = `pro-headshot-${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[600px] relative bg-zinc-900/30 rounded-2xl border border-zinc-800/50 overflow-hidden flex flex-col">

      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Original Image Panel */}
        <div className={`relative flex-1 transition-all duration-500 ${generatedUrl ? 'lg:basis-1/2' : 'basis-full'} border-r border-zinc-800/50 bg-zinc-900/20`}>
          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/60 backdrop-blur rounded-full border border-white/10 text-xs font-medium text-white/80">
            Original
          </div>
          <img
            src={originalUrl}
            alt="Original"
            className="w-full h-full object-contain p-4"
          />
        </div>

        {/* Generated Image Panel */}
        {(generatedUrl || isLoading) && (
          <div className="relative flex-1 lg:basis-1/2 bg-zinc-900/20 animate-in fade-in duration-700">
             <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-blue-600/80 backdrop-blur rounded-full border border-white/10 text-xs font-medium text-white shadow-lg shadow-blue-900/20">
               {isLoading ? 'Generating...' : 'Pro Headshot'}
             </div>

             {isLoading ? (
               <div className="w-full h-full flex items-center justify-center">
                  <div className="relative flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border-2 border-zinc-800 border-t-blue-500 animate-spin mb-4"></div>
                    <p className="text-zinc-400 text-sm animate-pulse">Optimizing lighting...</p>
                  </div>
               </div>
             ) : (
               generatedUrl && (
                 <img
                   src={generatedUrl}
                   alt="Generated"
                   className="w-full h-full object-contain p-4"
                 />
               )
             )}
          </div>
        )}
      </div>

      {generatedUrl && !isLoading && (
          <div className="p-4 border-t border-zinc-800/50 bg-zinc-900/40 flex justify-end items-center gap-4 backdrop-blur-sm absolute bottom-0 w-full">
             <span className="text-xs text-zinc-500 hidden sm:inline-block">Generated with Gemini 2.5 Flash</span>
             <Button variant="primary" onClick={handleDownload} className="shadow-lg shadow-white/10">
                <DownloadIcon className="w-4 h-4 mr-2" />
                {isPro ? 'Download HD' : 'Download (Free)'}
             </Button>
          </div>
      )}
    </div>
  );
};
