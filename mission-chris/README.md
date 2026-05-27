# MISSION CHRIS — pipeline TikTok automatisé

Statut : scaffold initial posé le 27 mai 2026. À valider avec George avant d'attaquer Semaine 1.

## Ce qu'on construit

Un profil Orion spécialisé pour Chris (créateur de contenu). Trois phases enchainées :

1. **Génération vidéo** : brief texte → clips MP4 9:16 (Veo / Runway / Kling)
2. **Montage** : MCP qui assemble, sous-titre, ajoute hook + CTA
3. **Publication TikTok** : endpoint Vercel qui parle à l'API officielle

Le tronc commun d'Orion ne bouge pas. On empile par-dessus.

## Arborescence

```
mission-chris/
  briefs/                    schémas + exemples de briefs
  agents/generation/         agent + abstraction provider
    providers/               veo, runway, kling (interface commune)
  mcp-montage/               MCP de montage (FFmpeg ou managé)
    tools/                   cut / concat / add_text / add_subtitles / add_music / export
  bridge-vercel/             endpoint Vercel pour publier sur TikTok
    api/tiktok/              publish, oauth, callback
  outputs/chris/
    raw/                     clips bruts générés par l'agent
    final/                   vidéos prêtes à publier
  scripts/                   utilitaires (lint brief, dry-run pipeline, etc.)
```

## Points critiques à ne pas oublier

- **Validation TikTok à lancer Semaine 1.** Le délai est hors de notre contrôle (jours à semaines). Sans ça la Phase 3 est bloquée en Semaine 4.
- **Pas de bridge cookies de session.** Trop risqué pour le compte de Chris. On garde l'arch Vercel mais derrière c'est OAuth + Content Posting API officielle.
- **Mode Inbox en filet de sécurité.** Tant que Direct Post n'est pas validé en prod, on pousse en brouillon TikTok et Chris valide depuis l'app.
- **Idempotency key par publication.** Jamais deux fois la même vidéo postée sur retry.
- **Plafond 15 publications / 24h** par compte via Direct Post. À intégrer côté scheduling.

## Décisions encore ouvertes (cf. §7 du briefing)

| Sujet | Options | Mon biais |
|---|---|---|
| Moteur génération | Veo 3.1 / Runway 4.5 / Kling 3.0 | Veo principal, Kling repli, abstraction commune |
| MCP montage | FFmpeg wrapper / Shotstack / Creatomate | Shotstack pour Semaine 3, FFmpeg si le volume justifie |
| Stockage | Drive / S3 | S3 pour les URLs signées TikTok |
| Dashboard | Notion / Airtable | Airtable plus tard, pas Semaine 1 |
| Facturation | Stripe metered / forfait | À voir avec George |
| Notifs | Slack / WhatsApp | Slack pour l'équipe, WhatsApp pour Chris |

## Planning 4 semaines

| Semaine | Livrable | Bloqueur |
|---|---|---|
| S1 | Démo Orion locale + soumission validation TikTok | Validation TikTok soumise ? |
| S2 | Agent générateur, 3 variantes sur un brief | Moteur choisi |
| S3 | Premier export TikTok-ready 9:16 | Techno montage tranchée |
| S4 | Première publication automatique pour Chris | Validation TikTok obtenue, sinon mode Inbox |

## Quickstart

```bash
cd mission-chris
cp .env.example .env       # remplir les clés (Veo, TikTok, Vercel)
npm install                # depuis la racine du repo
npm run mission:dry-run    # smoke test du pipeline avec un brief exemple
```
