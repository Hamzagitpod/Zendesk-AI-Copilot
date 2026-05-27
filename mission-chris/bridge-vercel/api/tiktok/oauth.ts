/**
 * GET /api/tiktok/oauth?action=start  → redirige vers TikTok auth
 * GET /api/tiktok/oauth?action=callback&code=...&state=...  → echange code → tokens
 *
 * Scope minimum : video.publish (Direct Post) ou video.upload (Inbox).
 * Tokens stockes chiffres dans Vercel KV / Upstash.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

const TIKTOK_AUTH = 'https://www.tiktok.com/v2/auth/authorize/';
const TIKTOK_TOKEN = 'https://open.tiktokapis.com/v2/oauth/token/';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = (req.query.action as string) || 'start';

  if (action === 'start') {
    const params = new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY ?? '',
      scope: 'video.publish,video.upload',
      response_type: 'code',
      redirect_uri: process.env.TIKTOK_REDIRECT_URI ?? '',
      state: randomState(),
    });
    return res.redirect(302, `${TIKTOK_AUTH}?${params}`);
  }

  if (action === 'callback') {
    const code = req.query.code as string;
    if (!code) return res.status(400).json({ error: 'missing_code' });

    const r = await fetch(TIKTOK_TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY ?? '',
        client_secret: process.env.TIKTOK_CLIENT_SECRET ?? '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.TIKTOK_REDIRECT_URI ?? '',
      }),
    });
    const tokens = await r.json();
    // TODO : chiffrer et stocker access_token + refresh_token dans KV
    return res.status(200).json({ stub: true, recu: Object.keys(tokens) });
  }

  return res.status(400).json({ error: 'unknown_action' });
}

function randomState(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
