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