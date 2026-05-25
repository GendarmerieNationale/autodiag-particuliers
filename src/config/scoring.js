// Scoring thresholds and tagging for the security level.
// Update these to recalibrate how "excellent / moyen / faible" are awarded.

export const SCORE_THRESHOLDS = Object.freeze({
  EXCELLENT: 70, // ≥ this pct → "excellent"
  MOYEN: 40, // ≥ this pct (and < EXCELLENT) → "moyen", else "faible"
})

export const SCORE_LEVELS = Object.freeze(['faible', 'moyen', 'excellent'])

// Questions answered on the TypeView (before the main questionnaire begins).
// They live outside maison.json / appartement.json but still count toward the score.
export const TYPE_QUESTION_IDS = Object.freeze(['type_eclairage', 'type_videoprotection'])

// Each TypeView question is worth at most 1 point (oui = 1, non = 0).
export const TYPE_QUESTION_MAX_POINTS = 1
