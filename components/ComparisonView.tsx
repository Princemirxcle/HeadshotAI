import React from 'react';
import { DownloadIcon } from './Icons';
import { Button } from './Button';

import { UserPlan } from '../types';

interface ComparisonViewProps {
  originalUrl: string;
  generatedUrl: string | null;
  isLoading: boolean;
  userPlan?: UserPlan;
  onUpgrade?: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ originalUrl, generatedUrl, isLoading, userPlan = 'free', onUpgrade }) => {
  const isFree = userPlan === 'free';
  
  const handleDownload = () => {
    if (generatedUrl) {
      const link = document.createElement('a');
      link.href = generatedUrl;
      link.download = `pro-headshot-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
             {isFree ? (
               <>
                 <span className="text-xs text-amber-400/80 hidden sm:inline-block">512px watermarked preview</span>
                 <Button variant="outline" onClick={handleDownload} className="shadow-lg shadow-white/10">
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download Preview
                 </Button>
                 {onUpgrade && (
                   <Button variant="primary" onClick={onUpgrade} className="shadow-lg shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-0 text-white">
                      Get 4K HD
                   </Button>
                 )}
               </>
             ) : (
               <>
                 <span className="text-xs text-zinc-500 hidden sm:inline-block">Generated with Gemini 2.5 Flash</span>
                 <Button variant="primary" onClick={handleDownload} className="shadow-lg shadow-white/10">
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download 4K HD
                 </Button>
               </>
             )}
          </div>
      )}
    </div>
  );
};