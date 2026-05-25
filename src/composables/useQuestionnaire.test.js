import { describe, it, expect, beforeEach } from 'vitest'
import { useQuestionnaire } from './useQuestionnaire.js'

describe('useQuestionnaire', () => {
  let q

  beforeEach(() => {
    q = useQuestionnaire()
    q.reset()
  })

  describe('initial state', () => {
    it('starts empty', () => {
      expect(q.state.logementType).toBeNull()
      expect(q.state.localisation).toBeNull()
      expect(q.state.answers).toEqual({})
      expect(q.state.sectionBadges).toEqual([])
      expect(q.state.finished).toBe(false)
      expect(q.score.value).toBe(0)
      expect(q.totalPossible.value).toBe(0)
      expect(q.scorePct.value).toBe(0)
      expect(q.scoreLevel.value).toBe('faible')
    })
  })

  describe('setLogementType', () => {
    it('selects maison and loads its questions', () => {
      q.setLogementType('maison')
      expect(q.state.logementType).toBe('maison')
      expect(q.allQuestions.value.length).toBeGreaterThan(0)
      expect(q.allQuestions.value[0]).toHaveProperty('id')
      expect(q.allQuestions.value[0]).toHaveProperty('section')
    })

    it('selects appartement and loads its questions', () => {
      q.setLogementType('appartement')
      expect(q.allQuestions.value.length).toBeGreaterThan(0)
    })

    it('clears prior answers when re-selecting a type', () => {
      q.setLogementType('maison')
      q.answer('any_q', 'oui', 1, 'test')
      expect(Object.keys(q.state.answers).length).toBe(1)
      q.setLogementType('appartement')
      expect(q.state.answers).toEqual({})
    })
  })

  describe('answer / unAnswer', () => {
    beforeEach(() => q.setLogementType('maison'))

    it('records an answer', () => {
      q.answer('ext_cloture', 'oui', 1, 'Cloture: oui')
      expect(q.state.answers['ext_cloture']).toEqual({
        value: 'oui',
        points: 1,
        label: 'Cloture: oui',
      })
    })

    it('removes answers passed in', () => {
      q.answer('q1', 'oui', 1, 'l1')
      q.answer('q2', 'non', 0, 'l2')
      q.unAnswer(['q1'])
      expect(q.state.answers['q1']).toBeUndefined()
      expect(q.state.answers['q2']).toBeDefined()
    })
  })

  describe('score', () => {
    beforeEach(() => q.setLogementType('maison'))

    it('sums points from answers', () => {
      q.answer('q1', 'oui', 1, 'l')
      q.answer('q2', 'oui', 1, 'l')
      q.answer('q3', 'non', 0, 'l')
      expect(q.score.value).toBe(2)
    })

    it('treats missing points as 0', () => {
      q.answer('q1', 'sais_pas', undefined, 'l')
      expect(q.score.value).toBe(0)
    })
  })

  describe('totalPossible (bug fix: only counts answered questions)', () => {
    beforeEach(() => q.setLogementType('maison'))

    it('is 0 when no answer was given', () => {
      expect(q.totalPossible.value).toBe(0)
    })

    it('sums max points of answered questions only — not the full question bank', () => {
      // Pick a real maison question with max option = 1.
      const sample = q.allQuestions.value[0]
      q.answer(sample.id, 'non', 0, 'l')

      // Only one question answered → totalPossible counts ONLY that question's max,
      // not allQuestions.length. This is the branching-bug regression test.
      const maxOfSample = Math.max(...Object.values(sample.options).map(o => o.points || 0))
      expect(q.totalPossible.value).toBe(maxOfSample)
      expect(q.totalPossible.value).toBeLessThan(q.allQuestions.value.length)
    })

    it('counts TypeView questions as worth 1 each', () => {
      q.answer('type_eclairage', 'oui', 1, 'l')
      q.answer('type_videoprotection', 'non', 0, 'l')
      expect(q.totalPossible.value).toBe(2)
    })
  })

  describe('scorePct', () => {
    beforeEach(() => q.setLogementType('maison'))

    it('is 0 when no answers (avoids division by zero)', () => {
      expect(q.scorePct.value).toBe(0)
    })

    it('returns 100 when all answers are best-case', () => {
      q.answer('type_eclairage', 'oui', 1, 'l')
      q.answer('type_videoprotection', 'oui', 1, 'l')
      expect(q.scorePct.value).toBe(100)
    })

    it('returns 50 when half are best-case', () => {
      q.answer('type_eclairage', 'oui', 1, 'l')
      q.answer('type_videoprotection', 'non', 0, 'l')
      expect(q.scorePct.value).toBe(50)
    })
  })

  describe('scoreLevel thresholds', () => {
    beforeEach(() => q.setLogementType('maison'))

    // Tests use TypeView questions (2 slots, each max 1) so percentage is exact.
    it("'excellent' at 100%", () => {
      q.answer('type_eclairage', 'oui', 1, 'l')
      q.answer('type_videoprotection', 'oui', 1, 'l')
      expect(q.scorePct.value).toBe(100)
      expect(q.scoreLevel.value).toBe('excellent')
    })

    it("'faible' at 0%", () => {
      q.answer('type_eclairage', 'non', 0, 'l')
      q.answer('type_videoprotection', 'non', 0, 'l')
      expect(q.scorePct.value).toBe(0)
      expect(q.scoreLevel.value).toBe('faible')
    })

    it("'moyen' at 50%", () => {
      q.answer('type_eclairage', 'oui', 1, 'l')
      q.answer('type_videoprotection', 'non', 0, 'l')
      expect(q.scorePct.value).toBe(50)
      expect(q.scoreLevel.value).toBe('moyen')
    })
  })

  describe('completeSection', () => {
    it('adds a section badge', () => {
      q.completeSection('Extérieurs')
      expect(q.state.sectionBadges).toEqual(['Extérieurs'])
    })

    it('is idempotent (no duplicates)', () => {
      q.completeSection('Extérieurs')
      q.completeSection('Extérieurs')
      expect(q.state.sectionBadges).toEqual(['Extérieurs'])
    })
  })

  describe('finishQuestionnaire / unfinish', () => {
    it('flips state.finished', () => {
      expect(q.state.finished).toBe(false)
      q.finishQuestionnaire()
      expect(q.state.finished).toBe(true)
      q.unfinish()
      expect(q.state.finished).toBe(false)
    })
  })

  describe('reset', () => {
    it('clears everything', () => {
      q.setLogementType('maison')
      q.setLocalisation('ville')
      q.answer('q1', 'oui', 1, 'l')
      q.completeSection('Extérieurs')
      q.finishQuestionnaire()

      q.reset()

      expect(q.state.logementType).toBeNull()
      expect(q.state.localisation).toBeNull()
      expect(q.state.answers).toEqual({})
      expect(q.state.sectionBadges).toEqual([])
      expect(q.state.finished).toBe(false)
    })
  })
})
