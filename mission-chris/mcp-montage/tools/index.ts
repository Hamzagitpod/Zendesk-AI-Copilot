/**
 * MCP Montage : outils atomiques exposes a Orion.
 * Signature identique quel que soit le backend (FFmpeg / Shotstack / Creatomate).
 *
 * Choix backend : variable d'env MONTAGE_BACKEND = ffmpeg | shotstack | creatomate.
 * Recommandation : demarrer sur shotstack (Semaine 3), passer a ffmpeg si volume justifie.
 */

export interface CutParams { input: string; start: number; end: number; output: string; }
export interface ConcatParams { inputs: string[]; transition?: 'cut' | 'fade'; output: string; }
export interface AddTextParams { input: string; text: string; position: 'top' | 'bottom'; font?: string; taille?: number; debut?: number; duree?: number; output: string; }
export interface AddSubtitlesParams { input: string; langue: 'fr'; style?: 'plein' | 'karaoke'; position?: 'milieu' | 'bas'; output: string; }
export interface AddMusicParams { input: string; track: string; volume?: number; ducking?: boolean; output: string; }
export interface ExportParams { input: string; preset: 'tiktok-9x16'; output: string; }

export interface MontageBackend {
  nom: string;
  cut(p: CutParams): Promise<{ output: string }>;
  concat(p: ConcatParams): Promise<{ output: string }>;
  add_text(p: AddTextParams): Promise<{ output: string }>;
  add_subtitles(p: AddSubtitlesParams): Promise<{ output: string }>;
  add_music(p: AddMusicParams): Promise<{ output: string }>;
  export(p: ExportParams): Promise<{ output: string }>;
}

export const PRESET_TIKTOK_9x16 = {
  ratio: '9:16',
  largeur: 1080,
  hauteur: 1920,
  codec_video: 'libx264',
  codec_audio: 'aac',
  conteneur: 'mp4',
  fps: 30,
  pix_fmt: 'yuv420p',
  duree_min_s: 3,
  duree_max_s: 60,
  poids_max_mo: 4096,
} as const;
