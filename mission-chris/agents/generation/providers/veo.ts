import type { Brief } from '../../../briefs/schema.js';
import { slugSujet } from '../../../briefs/schema.js';
import type { Provider, ClipGenere } from './types.js';
import { ProviderIndisponibleError } from './types.js';
import path from 'node:path';

/**
 * Veo 3.1 (Google) : moteur principal recommandé.
 * Audio natif, 4K en 9:16, bonne adhérence prompt.
 *
 * TODO Semaine 2 : brancher la vraie API @google/genai (deja en deps).
 * Aujourd'hui : stub qui valide la chaine d'orchestration sans appeler l'API.
 */
export class VeoProvider implements Provider {
  nom = 'veo' as const;

  async estDisponible(): Promise<boolean> {
    return Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
  }

  async generer(brief: Brief, dossierSortie: string): Promise<ClipGenere[]> {
    if (!(await this.estDisponible())) {
      throw new ProviderIndisponibleError('veo', 'GEMINI_API_KEY non defini');
    }
    const slug = slugSujet(brief.sujet);
    const date = new Date().toISOString().slice(0, 10);
    const promptBase = construirePrompt(brief);
    const clips: ClipGenere[] = [];
    for (let i = 1; i <= brief.nb_variantes; i++) {
      const chemin = path.join(dossierSortie, `${date}_${slug}_veo31_v${i}.mp4`);
      clips.push({
        moteur: 'veo',
        variante: i,
        chemin_local: chemin,
        prompt_utilise: `${promptBase} [variante ${i}]`,
        duree_reelle_s: brief.duree_cible,
        seed: 1000 + i,
        cout_estime_usd: 1.5,
        meta: { stub: true, note: 'a brancher sur Veo 3.1 fast' },
      });
    }
    return clips;
  }
}

function construirePrompt(b: Brief): string {
  return [
    `Sujet: ${b.sujet}.`,
    `Ton: ${b.ton}.`,
    `Style: ${b.style_visuel}.`,
    `Format: vertical 9:16, ${b.duree_cible}s.`,
    `Hook: "${b.hook}". CTA: "${b.cta}".`,
    `Langue: francais.`,
  ].join(' ');
}
