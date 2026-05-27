/**
 * Brief : contrat d'entrée unique pour les 3 phases du pipeline.
 * Le générateur, le montage et la caption TikTok lisent tous ce même objet.
 */

export type Ton = 'energique' | 'pedagogique' | 'humoristique' | 'inspirant';
export type Moteur = 'veo' | 'runway' | 'kling';

export interface Brief {
  sujet: string;
  ton: Ton;
  format: '9:16';
  duree_cible: number;        // secondes, borne 3..60
  style_visuel: string;
  nb_variantes: number;       // 1..5 raisonnable
  hook: string;               // texte affiché en haut au montage
  cta: string;                // texte affiché en bas au montage
  langue: 'fr';
  moteur_prefere?: Moteur;
  hashtags?: string[];        // pour la caption TikTok
}

export interface BriefValidationResult {
  ok: boolean;
  erreurs: string[];
}

export function validerBrief(b: Partial<Brief>): BriefValidationResult {
  const erreurs: string[] = [];
  if (!b.sujet || b.sujet.trim().length < 3) erreurs.push('sujet trop court');
  if (b.format && b.format !== '9:16') erreurs.push('format doit etre 9:16');
  if (typeof b.duree_cible !== 'number' || b.duree_cible < 3 || b.duree_cible > 60) {
    erreurs.push('duree_cible doit etre entre 3 et 60 secondes');
  }
  if (typeof b.nb_variantes !== 'number' || b.nb_variantes < 1 || b.nb_variantes > 5) {
    erreurs.push('nb_variantes doit etre entre 1 et 5');
  }
  if (!b.hook) erreurs.push('hook manquant');
  if (!b.cta) erreurs.push('cta manquant');
  return { ok: erreurs.length === 0, erreurs };
}

export function slugSujet(sujet: string): string {
  return sujet
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}
