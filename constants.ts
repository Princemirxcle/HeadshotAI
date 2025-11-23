import { PresetPrompt } from "./types";

export const PRESET_PROMPTS: PresetPrompt[] = [
  {
    id: 'professional-studio',
    label: 'Studio Headshot',
    description: 'Clean dark background, soft lighting.',
    prompt: 'Edit this image to look like a professional studio headshot. Replace the background with a solid, high-quality dark grey smooth backdrop. Apply soft, flattering studio lighting to the face. \n\nCRITICAL INSTRUCTION: You MUST preserve the person\'s facial features, identity, and expression exactly as they are. Do not generate a new face. Only modify the background and lighting quality.',
    icon: 'camera'
  },
  {
    id: 'corporate-office',
    label: 'Corporate Office',
    description: 'Blurred office background, suit.',
    prompt: 'Edit this photo to place the subject in a professional corporate office setting. Change the background to a blurred, modern glass office depth-of-field effect. Change the clothing to a sharp, dark business suit. \n\nCRITICAL INSTRUCTION: Keep the face 100% identical to the original image. Do NOT alter the eyes, nose, mouth, or facial structure. The identity must remain unchanged.',
    icon: 'building'
  },
  {
    id: 'tech-modern',
    label: 'Tech Founder',
    description: 'Modern, bright, smart casual.',
    prompt: 'Transform this into a Silicon Valley tech founder portrait. Change the background to a bright, airy, blurred architectural space or outdoor campus. Change clothing to high-end smart casual (e.g., a quality plain t-shirt or sweater). \n\nCRITICAL INSTRUCTION: Do not change the person\'s face. The identity, facial structure, and expression must be preserved exactly. Only edit the environment and attire.',
    icon: 'laptop'
  },
  {
    id: 'creative-minimal',
    label: 'Creative B&W',
    description: 'High contrast, monochrome.',
    prompt: 'Apply a high-contrast black and white artistic filter. Remove the background and replace it with pure black. Enhance the lighting to be dramatic. \n\nCRITICAL INSTRUCTION: Preserve the facial features and identity completely. Do not alter the face.',
    icon: 'sparkles'
  },
  {
    id: 'custom-edit',
    label: 'Magic Edit',
    description: 'Type your own custom request.',
    prompt: '',
    icon: 'wand'
  }
];

export const DEFAULT_CUSTOM_PROMPT = "Fix lighting and make the background look professional.";
