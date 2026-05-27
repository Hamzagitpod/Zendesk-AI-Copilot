/**
 * Smoke test : lit briefs/exemple.json, lance l'agent en mode stub,
 * verifie que la chaine d'orchestration et le nommage tiennent debout.
 *
 *   npx tsx mission-chris/scripts/dry-run.ts
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Brief } from '../briefs/schema.js';
import { AgentGeneration } from '../agents/generation/index.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

async function main() {
  const brief = JSON.parse(
    await fs.readFile(path.join(ROOT, 'briefs/exemple.json'), 'utf8')
  ) as Brief;

  // Force la presence d'une clef pour passer estDisponible dans le stub Veo.
  process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? 'stub-key';

  const dossierRaw = path.join(ROOT, 'outputs/chris/raw');
  const agent = new AgentGeneration();
  const rapport = await agent.lancer(brief, dossierRaw);

  console.log('Moteur utilise :', rapport.moteur_utilise);
  console.log('Echecs         :', rapport.echecs);
  console.log('Clips planifies :');
  for (const c of rapport.clips) {
    console.log(`  v${c.variante}  ${c.chemin_local}`);
  }
  console.log('\nProchaine etape : brancher la vraie API Veo dans providers/veo.ts');
}

main().catch(e => { console.error(e); process.exit(1); });
