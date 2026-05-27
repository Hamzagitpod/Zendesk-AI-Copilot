import type { Brief } from '../../../briefs/schema.js';
import { slugSujet } from '../../../briefs/schema.js';
import type { Provider, ClipGenere } from './types.js';
import { ProviderIndisponibleError } from './types.js';
import path from 'node:path';

/**
 * Kling 3.0 (Kuaishou) : repli si Veo en waitlist ou pour les plans
 * avec personnages. Dispo sans waitlist.
 *
 * TODO Semaine 2 : brancher l'API Kling (clef KLING_API_KEY).
 */
export class KlingProvider implements Provider {
  nom = 'kling' as const;

  async estDisponible(): Promise<boolean> {
    return Boolean(process.env.KLING_API_KEY);
  }

  async generer(brief: Brief, dossierSortie: string): Promise<ClipGenere[]> {
    if (!(await this.estDisponible())) {
      throw new ProviderIndisponibleError('kling', 'KLING_API_KEY non defini');
    }
    const slug = slugSujet(brief.sujet);
    const date = new Date().toISOString().slice(0, 10);
    const clips: ClipGenere[] = [];
    for (let i = 1; i <= brief.nb_variantes; i++) {
      clips.push({
        moteur: 'kling',
        variante: i,
        chemin_local: path.join(dossierSortie, `${date}_${slug}_kling30_v${i}.mp4`),
        prompt_utilise: `${brief.sujet} | ${brief.ton} | ${brief.style_visuel} [v${i}]`,
        duree_reelle_s: brief.duree_cible,
        seed: 2000 + i,
        meta: { stub: true },
      });
    }
    return clips;
  }
}
