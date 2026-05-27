/**
 * Abstraction provider : une seule interface pour Veo, Runway, Kling.
 * Le reste du pipeline ne sait jamais quel moteur a généré le clip.
 */
import type { Brief } from '../../../briefs/schema.js';

export interface ClipGenere {
  moteur: 'veo' | 'runway' | 'kling';
  variante: number;
  chemin_local: string;       // /outputs/chris/raw/...mp4
  prompt_utilise: string;
  duree_reelle_s: number;
  seed?: number;
  cout_estime_usd?: number;
  meta: Record<string, unknown>;
}

export interface Provider {
  nom: 'veo' | 'runway' | 'kling';
  estDisponible(): Promise<boolean>;
  /** Lance les N variantes en parallele, attend les rendus, ecrit les MP4. */
  generer(brief: Brief, dossierSortie: string): Promise<ClipGenere[]>;
}

export class ProviderIndisponibleError extends Error {
  constructor(public moteur: string, raison: string) {
    super(`Provider ${moteur} indisponible : ${raison}`);
  }
}
