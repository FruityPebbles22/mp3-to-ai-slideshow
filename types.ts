export enum AppState {
  IDLE,
  CONFIGURING,
  GENERATING,
  PLAYING,
}

export const StyleOptions = [
  'Abstract', 'Anime', 'Cinematic', 'Cosmic', 'Cyberpunk', 'Fantasy', 'Furry', 
  'Gothic', 'Impressionism', 'Landscapes', 'Minimalist', 'Monochrome', 'Pop Art', 
  'Portraits', 'Realism', 'Retro', 'Steampunk', 'Surrealism', 'Vibrant', 'Watercolor'
] as const;

export type StyleOption = typeof StyleOptions[number];

export interface SlideshowImage {
  url: string;
  prompt: string;
}