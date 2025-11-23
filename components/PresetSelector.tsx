import React from 'react';
import { PRESET_PROMPTS } from '../constants';
import { PresetPrompt } from '../types';
import { CameraIcon, BuildingIcon, LaptopIcon, SparklesIcon, WandIcon } from './Icons';

interface PresetSelectorProps {
  selectedPresetId: string | null;
  onSelect: (preset: PresetPrompt) => void;
}

const getIcon = (iconName?: string, className?: string) => {
  switch (iconName) {
    case 'camera': return <CameraIcon className={className} />;
    case 'building': return <BuildingIcon className={className} />;
    case 'laptop': return <LaptopIcon className={className} />;
    case 'sparkles': return <SparklesIcon className={className} />;
    case 'wand': return <WandIcon className={className} />;
    default: return <SparklesIcon className={className} />;
  }
};

export const PresetSelector: React.FC<PresetSelectorProps> = ({ selectedPresetId, onSelect }) => {
  return (
    <div className="flex flex-col gap-2 mb-6">
      {PRESET_PROMPTS.map((preset) => {
        const isSelected = selectedPresetId === preset.id;
        return (
            <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            className={`group relative flex items-center w-full p-3 rounded-xl border transition-all duration-200 text-left gap-3
                ${isSelected
                ? 'bg-zinc-800 border-blue-500/50 shadow-[0_0_10px_-2px_rgba(59,130,246,0.2)]' 
                : 'bg-zinc-900/20 border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-800/40'
                }
            `}
            >
            <div className={`p-2 rounded-lg transition-colors ${isSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-400 group-hover:text-zinc-300'}`}>
                {getIcon(preset.icon, "w-5 h-5")}
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between w-full mb-0.5">
                    <span className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                        {preset.label}
                    </span>
                </div>
                <p className="text-xs text-zinc-500 truncate group-hover:text-zinc-400">
                    {preset.description}
                </p>
            </div>

            {isSelected && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
            )}
            </button>
        );
      })}
    </div>
  );
};
