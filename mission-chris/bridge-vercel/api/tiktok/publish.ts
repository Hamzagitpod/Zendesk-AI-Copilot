/**
 * POST /api/tiktok/publish
 *
 * Endpoint Vercel : Orion appelle ici, le bridge parle a TikTok Content Posting API.
 * Aucune session cookie : OAuth officiel uniquement.
 *
 * Payload entrant (depuis Orion) :
 * {
 *   "video_path": "/outputs/chris/final/2026-05-26_..._final.mp4",
 *   "caption": "...",
 *   "hashtags": ["productivite","fyp"],
 *   "schedule_at": "2026-05-27T08:00:00Z",   // optionnel
 *   "mode": "direct" | "inbox"                // par defaut "inbox" tant que app non validee
 * }
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'node:crypto';

interface PublishPayload {
  video_path: string;
  caption: string;
  hashtags?: string[];
  schedule_at?: string;
  mode?: 'direct' | 'inbox';
  idempotency_key?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const auth = req.headers.authorization ?? '';
  if (!verifierBearer(auth)) return res.status(401).json({ error: 'unauthorized' });

  const payload = req.body as PublishPayload;
  const v = validerPayload(payload);
  if (!v.ok) return res.status(400).json({ error: 'invalid_payload', details: v.erreurs });

  const idem = payload.idempotency_key ?? crypto.createHash('sha256')
    .update(payload.video_path + payload.caption).digest('hex').slice(0, 32);

  // TODO Semaine 4 :
  // 1. recuperer/rafraichir access_token TikTok de Chris (refresh_token chiffre en KV)
  // 2. init upload (POST /v2/post/publish/inbox/video/init/ OU .../direct_post/video/init/)
  // 3. upload chunked du MP4 (URL S3 signee ou stream depuis Drive)
  // 4. retry exponentiel sur 5xx ; pas de retry sur 4xx
  // 5. log JSON structure (request_id, idem, statut, raw response)
  // 6. webhook Slack/WhatsApp sur succes/echec

  const mode = payload.mode ?? 'inbox';
  return res.status(202).json({
    accepted: true,
    idempotency_key: idem,
    mode,
    stub: true,
    note: 'Implementation reelle Semaine 4 ; mode inbox par defaut tant que validation TikTok pas obtenue',
  });
}

function verifierBearer(auth: string): boolean {
  const token = auth.replace(/^Bearer\s+/i, '');
  const attendu = process.env.BRIDGE_API_KEY;
  if (!token || !attendu) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(attendu));
}

function validerPayload(p: PublishPayload | undefined) {
  const erreurs: string[] = [];
  if (!p) return { ok: false, erreurs: ['payload vide'] };
  if (!p.video_path) erreurs.push('video_path requis');
  if (!p.caption) erreurs.push('caption requise');
  if (p.mode && p.mode !== 'direct' && p.mode !== 'inbox') erreurs.push('mode doit etre direct ou inbox');
  if (p.schedule_at && Number.isNaN(Date.parse(p.schedule_at))) erreurs.push('schedule_at invalide');
  return { ok: erreurs.length === 0, erreurs };
}
