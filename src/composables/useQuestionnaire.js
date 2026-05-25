import { reactive, computed } from 'vue'
import maisonData from '@/data/maison.json'
import appartementData from '@/data/appartement.json'
import { SCORE_THRESHOLDS, TYPE_QUESTION_IDS, TYPE_QUESTION_MAX_POINTS } from '@/config/scoring.js'

/**
 * @typedef {'maison' | 'appartement'} LogementType
 * @typedef {'oui' | 'non' | 'sais_pas'} AnswerValue
 * @typedef {'excellent' | 'moyen' | 'faible'} ScoreLevel
 *
 * @typedef {Object} AnswerRecord
 * @property {AnswerValue} value
 * @property {number}      points
 * @property {string}      label
 *
 * @typedef {Object} QuestionnaireState
 * @property {LogementType | null} logementType
 * @property {string | null}       localisation
 * @property {Record<string, AnswerRecord>} answers      Keyed by question id.
 * @property {string[]}            sectionBadges        Section names already completed.
 * @property {boolean}             finished
 */

/** @type {QuestionnaireState} */
const state = reactive({
  logementType: null,
  localisation: null,
  answers: {},
  sectionBadges: [],
  finished: false,
})

/** @param {LogementType} type */
function setLogementType(type) {
  state.logementType = type
  state.answers = {}
  state.sectionBadges = []
  state.finished = false
}

function setLocalisation(localisation) {
  state.localisation = localisation
}

/**
 * Record (or overwrite) an answer for a single question.
 * @param {string}      questionId
 * @param {AnswerValue} value
 * @param {number}      points
 * @param {string}      label
 */
function answer(questionId, value, points, label) {
  state.answers[questionId] = { value, points, label }
}

function completeSection(section) {
  if (!state.sectionBadges.includes(section)) {
    state.sectionBadges.push(section)
  }
}

/** Remove answers for a list of question ids (used when editing or branching back). */
function unAnswer(questionIds) {
  questionIds.forEach(id => {
    delete state.answers[id]
  })
}

function finishQuestionnaire() {
  state.finished = true
}

function unfinish() {
  state.finished = false
}

function reset() {
  state.logementType = null
  state.localisation = null
  state.answers = {}
  state.sectionBadges = []
  state.finished = false
}

const allQuestions = computed(() =>
  state.logementType === 'maison' ? maisonData : appartementData
)

const questionById = computed(() => {
  const m = {}
  allQuestions.value.forEach(q => {
    m[q.id] = q
  })
  return m
})

/** Total points earned. */
const score = computed(() =>
  Object.values(state.answers).reduce((sum, a) => sum + (a.points || 0), 0)
)

/**
 * Maximum points achievable for the **questions actually answered** so far.
 *
 * Earlier versions used `allQuestions.length + 2`, which was wrong: question
 * branching (via `nextId`) skips entire sub-paths, so the real ceiling depends
 * on the path the user walked. This implementation sums each answered
 * question's best possible option, plus a fixed 1 point per TypeView question.
 */
const totalPossible = computed(() => {
  let total = 0
  for (const id of Object.keys(state.answers)) {
    if (TYPE_QUESTION_IDS.includes(id)) {
      total += TYPE_QUESTION_MAX_POINTS
      continue
    }
    const q = questionById.value[id]
    if (!q || !q.options) continue
    total += Math.max(...Object.values(q.options).map(o => o.points || 0))
  }
  return total
})

const scorePct = computed(() => {
  if (!totalPossible.value) return 0
  return Math.round((score.value / totalPossible.value) * 100)
})

/** @returns {ScoreLevel} */
const scoreLevel = computed(() => {
  const pct = scorePct.value
  if (pct >= SCORE_THRESHOLDS.EXCELLENT) return 'excellent'
  if (pct >= SCORE_THRESHOLDS.MOYEN) return 'moyen'
  return 'faible'
})

export function useQuestionnaire() {
  return {
    state,
    score,
    totalPossible,
    scorePct,
    scoreLevel,
    allQuestions,
    setLogementType,
    setLocalisation,
    answer,
    unAnswer,
    completeSection,
    finishQuestionnaire,
    unfinish,
    reset,
  }
}
