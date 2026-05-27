/**
 * Agent generation : orchestre les providers, gere repli, ecrit les sidecars JSON.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { validerBrief } from '../../briefs/schema.js';
import type { Brief } from '../../briefs/schema.js';
import type { Provider, ClipGenere } from './providers/types.js';
import { VeoProvider } from './providers/veo.js';
import { KlingProvider } from './providers/kling.js';

export interface RapportGeneration {
  brief: Brief;
  clips: ClipGenere[];
  moteur_utilise: string;
  echecs: { moteur: string; raison: string }[];
}

export class AgentGeneration {
  private providers: Provider[];

  constructor(providers?: Provider[]) {
    this.providers = providers ?? [new VeoProvider(), new KlingProvider()];
  }

  async lancer(brief: Brief, dossierRaw: string): Promise<RapportGeneration> {
    const v = validerBrief(brief);
    if (!v.ok) throw new Error('Brief invalide : ' + v.erreurs.join(' ; '));

    await fs.mkdir(dossierRaw, { recursive: true });

    const echecs: { moteur: string; raison: string }[] = [];
    const ordre = trierProviders(this.providers, brief.moteur_prefere);

    for (const p of ordre) {
      try {
        const clips = await p.generer(brief, dossierRaw);
        await ecrireSidecars(clips, brief);
        return { brief, clips, moteur_utilise: p.nom, echecs };
      } catch (e) {
        echecs.push({ moteur: p.nom, raison: (e as Error).message });
      }
    }
    throw new Error('Tous les providers ont echoue : ' + JSON.stringify(echecs));
  }
}

function trierProviders(providers: Provider[], prefere?: string): Provider[] {
  if (!prefere) return providers;
  const pref = providers.filter(p => p.nom === prefere);
  const reste = providers.filter(p => p.nom !== prefere);
  return [...pref, ...reste];
}

async function ecrireSidecars(clips: ClipGenere[], brief: Brief): Promise<void> {
  for (const c of clips) {
    const sidecar = c.chemin_local.replace(/\.mp4$/, '.json');
    await fs.writeFile(sidecar, JSON.stringify({ brief, clip: c }, null, 2));
  }
}
