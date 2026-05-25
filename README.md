# Auto-diagnostic Sûreté Habitation

> Outil développé par **MHAILI Majda** — **CPTM 33 · Cellule de Prévention Technique de la Malveillance**

---

## Présentation

Application web d'auto-diagnostic permettant aux citoyens d'évaluer le niveau de sécurité de leur habitation (maison individuelle ou appartement) face aux risques d'intrusion et de cambriolage.

À l'issue du questionnaire, l'utilisateur obtient :

- un **niveau de sécurité** (Insuffisant / Moyen / Excellent) ;
- des **conseils personnalisés** selon ses réponses ;
- un **rapport PDF téléchargeable** récapitulant le diagnostic et les préconisations.

---

## Stack technique

| Technologie  
| -----------------------------------------------------
| [Vue 3](https://vuejs.org/)  
| [@gouvminint/vue-dsfr](https://vue-dsfr.netlify.app/)

---

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/GendarmerieNationale/autodiag-particuliers.git
cd Auto-diagnostic

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

---

## Build & déploiement

```bash
# Construire pour la production
npm run build

# Déployer sur GitHub Pages (branche gh-pages)
npm run deploy
```

L'application est déployée à l'adresse :
**https://GendarmerieNationale.github.io/Auto-diagnostic/**

---

## Qualité du code

```bash
npm run lint           # ESLint
npm run lint:fix       # ESLint + auto-fix
npm run format         # Prettier (réécrit les fichiers)
npm run format:check   # Prettier en mode vérification (utilisé en CI)
npm test               # Tests unitaires (Vitest)
npm run test:watch     # Tests en mode watch
```

La CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) exécute lint + format check + tests + build sur chaque pull request.

---

## Données

Les questionnaires et conseils sont entièrement pilotés par des fichiers JSON dans `src/data/` — aucune base de données requise.

### Schéma `maison.json` / `appartement.json`

Un tableau de questions. Chaque question est un objet :

```json
{
  "id": "ext_cloture",
  "section": "Extérieurs",
  "text": "Votre maison est-elle clôturée ?",
  "type": "yesno",
  "info": "Texte d'aide optionnel, affiché sous la question.",
  "isLast": false,
  "options": {
    "oui":      { "points": 1, "nextId": "ext_cloture_hauteur" },
    "non":      { "points": 0, "nextId": "ext_facade_voie" },
    "sais_pas": { "points": 0, "nextId": "ext_facade_voie" }
  }
}
```

| Champ      | Type     | Description |
| ---------- | -------- | ----------- |
| `id`       | string   | Identifiant unique de la question (utilisé comme clé de `state.answers` et de `conseils.json`). |
| `section`  | string   | Section affichée à l'utilisateur (regroupe les questions). |
| `text`     | string   | Énoncé de la question. |
| `type`     | string   | `"yesno"` ou `"yesno_sais_pas"` (ajoute un 3ᵉ bouton « Je ne sais pas »). |
| `info`     | string?  | Optionnel — encart d'aide. |
| `isLast`   | boolean? | Optionnel — `true` pour la dernière question du questionnaire. |
| `options`  | object   | Clés : `"oui"`, `"non"`, et optionnellement `"sais_pas"`. Chacune a `points` (number) et `nextId` (string id de la question suivante, ou `null` pour finir). |

**Branchement** : `nextId` permet de sauter des questions. La logique de score (`useQuestionnaire.totalPossible`) ne compte que les questions effectivement répondues — ne pas s'inquiéter si certains chemins sont plus courts.

### `conseils.json`

Mapping `question_id → conseil personnalisé` affiché dans le PDF si la réponse donnée vaut 0 point.

```json
{
  "ext_cloture": "Pensez à clôturer votre propriété pour …",
  "ext_facade_voie": "…"
}
```

### `recommendations.json`

Conseils généraux groupés par thème, affichés dans le récapitulatif et le PDF.

```json
[
  {
    "titre": "Aux abords de votre habitation",
    "icone": "ri-landscape-line",
    "contenu": ["…", "…"]
  }
]
```

---

## Configuration

`src/config/` contient les valeurs paramétrables :

- [scoring.js](src/config/scoring.js) — seuils `excellent` (≥ 70 %) et `moyen` (≥ 40 %), questions hors questionnaire principal.
- [ui.js](src/config/ui.js) — durée de l'overlay de transition entre sections.
- [links.js](src/config/links.js) — URLs externes (MaSécurité, OTV, etc.).

Modifier un de ces fichiers suffit à recalibrer le score ou changer une URL — pas besoin de toucher au code des vues.

---

## Licence

Ce projet est publié sous la **Licence Ouverte 2.0 / Open Licence 2.0** d'Etalab.

Texte complet : https://github.com/etalab/licence-ouverte/blob/master/LO.md

**Auteur** : MHAILI Majda — Gendarmerie Nationale · CPTM 33
