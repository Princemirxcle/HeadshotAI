export interface ImageState {
  file: File | null;
  previewUrl: string | null; // The original image URL (blob or base64)
  base64Data: string | null; // Pure base64 string (no prefix) for API
  mimeType: string;
}

export interface GeneratedResult {
  imageUrl: string; // Data URL of generated image
  promptUsed: string;
  timestamp: number;
}

export enum GenerationStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface PresetPrompt {
  id: string;
  label: string;
  description: string;
  prompt: string;
  icon?: string;
}

export type UserPlan = 'free' | 'pro';

export const FREE_TIER = {
  maxGenerations: 1,
  maxResolution: 512,
  watermark: true,
} as const;

export const PRO_TIER = {
  maxGenerations: Infinity,
  maxResolution: 4096,
  watermark: false,
} as const;