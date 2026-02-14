import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { SparklesIcon, UploadIcon, PhotoIcon, WandIcon } from './Icons';
import { Button } from './Button';
import { PresetSelector } from './PresetSelector';
import { ComparisonView } from './ComparisonView';
import { editImageWithGemini, fileToBase64 } from '../services/geminiService';
import { processForFreeTier } from '../services/imageProcessing';
import { ImageState, GenerationStatus, PresetPrompt, UserPlan, FREE_TIER } from '../types';
import { PRESET_PROMPTS } from '../constants';

interface EditorViewProps {
  userPlan: UserPlan;
  onUpgrade: () => void;
}

export const EditorView: React.FC<EditorViewProps> = ({ userPlan, onUpgrade }) => {
  const [imageState, setImageState] = useState<ImageState>({
    file: null,
    previewUrl: null,
    base64Data: null,
    mimeType: '',
  });

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_PROMPTS[0].id);
  const [customPrompt, setCustomPrompt] = useState<string>(PRESET_PROMPTS[0].prompt);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [freeGenerationsUsed, setFreeGenerationsUsed] = useState(0);

  const isFree = userPlan === 'free';
  const hasReachedFreeLimit = isFree && freeGenerationsUsed >= FREE_TIER.maxGenerations;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const promptTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        toast.error('File size too large. Please try an image under 5MB.');
        return;
    }

    try {
      const { base64, mimeType, url } = await fileToBase64(file);
      setImageState({
        file,
        previewUrl: url,
        base64Data: base64,
        mimeType,
      });
      setGeneratedImage(null);
      setStatus(GenerationStatus.IDLE);
    } catch (e) {
      console.error(e);
      toast.error('Failed to process image.');
    }
  };

  const handlePresetSelect = (preset: PresetPrompt) => {
    setSelectedPresetId(preset.id);
    
    if (preset.id === 'custom-edit') {
        setIsCustomMode(true);
        setCustomPrompt(''); 
        setTimeout(() => promptTextareaRef.current?.focus(), 100);
    } else {
        setCustomPrompt(preset.prompt);
        setIsCustomMode(false);
    }
  };

  const handleGenerate = async () => {
    if (!imageState.base64Data) return;
    if (!customPrompt.trim()) {
        toast.error("Please describe the edit you want to make.");
        return;
    }
    if (hasReachedFreeLimit) {
        toast.error("You've used your free preview. Upgrade to Pro for unlimited generations.");
        return;
    }

    setStatus(GenerationStatus.LOADING);

    try {
      let resultUrl = await editImageWithGemini(
        imageState.base64Data,
        imageState.mimeType,
        customPrompt
      );

      // Free tier: downscale to 512px and apply watermark
      if (isFree) {
        resultUrl = await processForFreeTier(resultUrl, FREE_TIER.maxResolution);
        setFreeGenerationsUsed((prev) => prev + 1);
      }

      setGeneratedImage(resultUrl);
      setStatus(GenerationStatus.SUCCESS);
    } catch (error: any) {
      console.error(error);
      setStatus(GenerationStatus.ERROR);
      toast.error(error.message || 'Failed to generate image. Please try again.');
    }
  };

  const handleReset = () => {
    setImageState({ file: null, previewUrl: null, base64Data: null, mimeType: '' });
    setGeneratedImage(null);
    setStatus(GenerationStatus.IDLE);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full h-full flex flex-col">
        {!imageState.previewUrl ? (
            // Empty State
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in duration-500">
                <div className="mb-8 relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-brand-600/20 to-violet-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative w-24 h-24 bg-zinc-900/50 rounded-3xl flex items-center justify-center border border-zinc-800 shadow-2xl shadow-black">
                    <PhotoIcon className="w-10 h-10 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                </div>
                </div>
                
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
                Upload your selfie
                </h1>
                <p className="text-lg text-zinc-400 mb-10 max-w-lg mx-auto leading-relaxed">
                We'll apply the chosen style in seconds.
                </p>

                <div className="relative z-10">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    id="editor-upload"
                />
                <label
                    htmlFor="editor-upload"
                    className="cursor-pointer group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-full text-lg transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-95 shadow-xl shadow-brand-900/50"
                >
                    <UploadIcon className="w-5 h-5" />
                    Select Photo
                </label>
                </div>
            </div>
            ) : (
            // Editor Workspace
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in-50 duration-500">
                
                {/* Left Panel - Controls */}
                <div className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1 h-fit lg:sticky lg:top-28">
                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">
                            Edit Settings
                        </h2>
                        <button 
                            onClick={handleReset} 
                            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                <path fillRule="evenodd" d="M7.793 2.232a.75.75 0 01-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 010 10.75H10.75a.75.75 0 010-1.5h2.875a3.875 3.875 0 000-7.75H3.622l4.146 3.957a.75.75 0 01-1.036 1.085l-5.5-5.25a.75.75 0 010-1.085l5.5-5.25a.75.75 0 011.06.025z" clipRule="evenodd" />
                            </svg>
                            Start Over
                        </button>
                    </div>

                    <div className="mb-6">
                        <label className="text-xs text-zinc-500 font-medium mb-3 block ml-1">PRESETS</label>
                        <PresetSelector 
                            selectedPresetId={selectedPresetId} 
                            onSelect={handlePresetSelect} 
                        />
                    </div>

                    <div className="mb-6 relative">
                        <div className="flex items-center justify-between mb-2 ml-1">
                            <label className="text-xs text-zinc-500 font-medium block">
                                {isCustomMode ? 'CUSTOM INSTRUCTIONS' : 'PROMPT DETAILS'}
                            </label>
                            {!isCustomMode && (
                                <button 
                                    onClick={() => {
                                        setIsCustomMode(true);
                                        setSelectedPresetId('custom-edit');
                                        setTimeout(() => promptTextareaRef.current?.focus(), 100);
                                    }}
                                    className="text-[10px] uppercase tracking-wide text-brand-400 hover:text-brand-300 font-medium"
                                >
                                    Tweak this preset
                                </button>
                            )}
                        </div>
                        
                        <div className={`relative group transition-all duration-200 ${isCustomMode ? 'ring-2 ring-brand-500/20 rounded-xl' : ''}`}>
                            <textarea
                                ref={promptTextareaRef}
                                className={`w-full h-32 px-4 py-3 bg-black/20 border rounded-xl text-sm transition-all resize-none focus:outline-none focus:bg-black/40 ${
                                    isCustomMode 
                                        ? 'border-brand-500/30 text-zinc-100 placeholder-zinc-600' 
                                        : 'border-zinc-800/50 text-zinc-500 cursor-not-allowed bg-zinc-900/20'
                                }`}
                                value={customPrompt}
                                onChange={(e) => {
                                    setCustomPrompt(e.target.value);
                                    if (!isCustomMode) {
                                        setIsCustomMode(true);
                                        setSelectedPresetId('custom-edit');
                                    }
                                }}
                                placeholder="e.g. Remove the background, add cinematic lighting..."
                                readOnly={!isCustomMode}
                            />
                            {isCustomMode && (
                                <div className="absolute bottom-3 right-3">
                                    <WandIcon className="w-4 h-4 text-brand-500/50" />
                                </div>
                            )}
                        </div>
                    </div>

                    {hasReachedFreeLimit ? (
                        <Button
                            onClick={onUpgrade}
                            className="w-full py-3.5 text-sm font-semibold shadow-lg shadow-blue-900/20 active:translate-y-0.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0"
                        >
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                                Upgrade to Pro
                            </span>
                        </Button>
                    ) : (
                        <Button
                            onClick={handleGenerate}
                            isLoading={status === GenerationStatus.LOADING}
                            className="w-full py-3.5 text-sm font-semibold shadow-lg shadow-brand-900/20 active:translate-y-0.5 bg-brand-600 hover:bg-brand-500 text-white border-0"
                        >
                            {status === GenerationStatus.LOADING ? (
                                <span className="flex items-center">Processing...</span>
                            ) : (
                                <span className="flex items-center">
                                    <SparklesIcon className="w-4 h-4 mr-2" />
                                    {isFree ? 'Generate Free Preview' : 'Generate Image'}
                                </span>
                            )}
                        </Button>
                    )}
                </div>

                {isFree && (
                    <div className="bg-blue-950/30 border border-blue-800/30 rounded-xl p-4 text-center">
                        {hasReachedFreeLimit ? (
                            <>
                                <p className="text-sm text-blue-300 font-medium mb-1">Free preview used</p>
                                <p className="text-xs text-zinc-400">Upgrade to Pro for unlimited 4K generations without watermarks.</p>
                            </>
                        ) : (
                            <>
                                <p className="text-xs text-zinc-400">
                                    <span className="text-blue-400 font-medium">Free plan:</span> 1 watermarked preview at 512px.{' '}
                                    <button onClick={onUpgrade} className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                                        Upgrade for 4K
                                    </button>
                                </p>
                            </>
                        )}
                    </div>
                )}

                <div className="px-2 text-center">
                    <p className="text-xs text-zinc-600">
                        Using <span className="text-zinc-500 font-medium">Gemini 2.5 Flash Image</span> for high-fidelity editing.
                    </p>
                </div>
                </div>

                {/* Right Panel - Preview */}
                <div className="lg:col-span-8 order-1 lg:order-2">
                <ComparisonView
                    originalUrl={imageState.previewUrl}
                    generatedUrl={generatedImage}
                    isLoading={status === GenerationStatus.LOADING}
                    userPlan={userPlan}
                    onUpgrade={onUpgrade}
                />
                </div>

            </div>
            )
        }
    </div>
  );
};
