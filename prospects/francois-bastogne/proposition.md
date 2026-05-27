# Proposition d'accompagnement Odoo — François (Bastogne)

**Préparée par :** Hamza
**Pour :** François — `franzbastogne` (+32 495 30 21 40)
**Date :** 24 novembre 2025
**Suite à :** échange Malt du 23/11/2025

---

## 1. Ce que vous m'avez demandé

Deux briques sur Odoo :

- **Formation** sur le POS (point de vente) et sur la comptabilité
- **Pilotage** : remonter 11 indicateurs business pour piloter le magasin

Liste des indicateurs (rappel) :

1. Montant investi vs ventes → marge
2. Rotation du stock (vitesse de sortie + produits dormants)
3. Évolution des ventes sur l'année
4. Tendances saisonnières (fêtes, rentrée, vacances)
5. Top / flops produits (logique 20/80)
6. Taux de rupture produits + ventes perdues
7. Performances par rayon
8. Impact promotions (marge réelle après remise)
9. Panier moyen (par client, par transaction)
10. Valeur du stock dormant
11. Achats hebdomadaires par fournisseur

Tout est faisable nativement dans Odoo (combinaison Stock, POS, Achats, Compta, plus quelques tableaux de bord custom).

---

## 2. Ma méthode

Trois temps clairs, vous pouvez vous arrêter après n'importe quel temps.

### Temps 1 — Audit + cadrage (0,5 jour, offert)

Avant le devis ferme, je passe **30 à 60 min** avec vous en visio pour :
- Voir votre version d'Odoo (Community ou Enterprise, online ou self-hosted, version 16/17/18)
- Identifier les modules déjà actifs (POS, Inventaire, Achats, Compta belge, Studio…)
- Confirmer le périmètre exact des 11 KPI (certains peuvent être natifs, d'autres demandent un dashboard custom)
- Récupérer un export anonymisé pour calibrer les rapports

**Offert** : on ne se quitte pas sans savoir si on est compatibles.

### Temps 2 — Formation (3 jours, 2 100 € HTVA)

Sur site ou en visio, à votre rythme.

| Jour | Contenu | Durée |
|---|---|---|
| J1 | **POS Odoo** : ouverture/clôture de session, ventes, retours, remises, multi-paiements, gestion caisse, écarts, configuration produits/catégories, codes-barres, programmes de fidélité, écrans clients | 7h |
| J2 | **Comptabilité belge** : PCMN, journaux, TVA (déclaration trimestrielle), lettrage clients/fournisseurs, rapprochements bancaires CODA, immobilisations, bilan + compte de résultat, clôture | 7h |
| J3 | **Lien POS ↔ Compta + achats** : flux comptable du POS, gestion des stocks à la vente, factures fournisseurs, valorisation stock, marges réelles | 7h |

Livrable : support PDF récap + checklist quotidienne + checklist clôture mensuelle.

### Temps 3 — Tableaux de bord des 11 KPI (4 jours, 2 800 € HTVA)

Je construis dans Odoo les rapports et dashboards correspondants, en m'appuyant au maximum sur le natif pour limiter la dette technique.

| KPI demandé | Comment je le livre | Source Odoo |
|---|---|---|
| Marge (investi vs ventes) | Vue pivot + dashboard avec marge brute et nette par période | Achats + POS Orders |
| Rotation stock | Rapport custom : ratio sorties / stock moyen, par produit et par rayon | Stock Moves |
| Évolution ventes annuelle | Graphique ligne sur 12 mois glissants + comparatif n-1 | POS Reports |
| Saisonnalité | Heatmap mensuelle, alertes sur pics historiques | POS Reports |
| Top/flops 20/80 | Liste triée par CA et par marge, badge Pareto | POS Order Lines |
| Taux de rupture + ventes perdues | Suivi des `stock = 0` pendant heures d'ouverture + estimation perte | Stock + POS |
| Performances par rayon | Pivot CA / marge / volume par catégorie produit | POS + Product Category |
| Impact promotions | Rapport "avant/pendant/après" avec marge réelle nette de remise | Pricelists + POS |
| Panier moyen | CA / nb tickets, par jour / semaine / vendeur | POS Orders |
| Stock dormant | Liste produits sans sortie depuis X jours + valeur immobilisée | Stock Quants |
| Achats hebdo fournisseurs | Pivot achats par fournisseur par semaine + alerte écart | Purchase Orders |

Livrable : **un menu "Pilotage François"** dans Odoo regroupant les 11 vues, partageable à votre équipe, exportable en Excel/PDF, plus une vidéo Loom de 10 min qui explique comment lire chaque dashboard.

### Temps 4 — Suivi mensuel (optionnel, 280 € HTVA / mois)

4h/mois de support : questions, ajustements de rapports, accompagnement clôture mensuelle. Engagement min. 3 mois, résiliable ensuite à tout moment.

---

## 3. Budget récapitulatif

| Poste | HTVA | TTC (TVA 21%) |
|---|---:|---:|
| Audit + cadrage | **0 €** | **0 €** |
| Formation (3 jours) | 2 100 € | 2 541 € |
| Dashboards 11 KPI (4 jours) | 2 800 € | 3 388 € |
| **Total mission initiale** | **4 900 €** | **5 929 €** |
| Suivi mensuel (optionnel) | 280 €/mois | 338,80 €/mois |

**Modalités**
- Facturation 40% à la commande, 30% à la fin de la formation, 30% à la livraison des dashboards
- Délai d'exécution : 3 à 4 semaines après audit
- Mes tarifs sont HTVA, TVA belge 21% applicable

---

## 4. Pourquoi moi

- Spécialiste Odoo, focus PME retail / POS / compta belge
- Je livre des dashboards qui se lisent en 30 secondes, pas des usines à gaz
- Documentation Loom + PDF systématique, vous n'êtes jamais dépendant de moi
- Disponible WhatsApp aux horaires ouvrés pour les questions courtes (inclus pendant la mission)

---

## 5. Prochaine étape

Je vous envoie ce document par WhatsApp aujourd'hui. On cale **l'audit cadrage de 45 min** dans la semaine, et à l'issue je vous transmets le devis ferme signable en ligne.

Hamza
+32 498 19 28 94
