<template>
  <div class="recap-page">
    <AppHeader />

    <main id="main-content" class="recap-main">
      <!-- Header -->
      <div class="recap-hero">
        <div class="recap-hero__icon"><i class="ri-list-check-3"></i></div>
        <h1 class="recap-hero__title">Récapitulatif de vos réponses</h1>
        <p class="recap-hero__sub">
          Vérifiez vos réponses avant de consulter votre résultat. Modifiez une section si vous avez
          fait une erreur.
        </p>
      </div>

      <!-- Sections -->
      <div class="recap-sections">
        <div v-for="section in sections" :key="section.name" class="recap-section">
          <!-- Section header -->
          <div class="recap-section__head">
            <div class="recap-section__title-row">
              <i
                :class="sectionIconMap[section.name] || 'ri-folder-open-line'"
                aria-hidden="true"
              ></i>
              <h2>{{ section.name }}</h2>
            </div>
            <button type="button" class="recap-edit-btn" @click="editSection(section.name)">
              <i class="ri-pencil-line" aria-hidden="true"></i>
              Modifier
            </button>
          </div>

          <!-- Questions list -->
          <ul class="recap-q-list">
            <li v-for="q in section.questions" :key="q.id" class="recap-q-item">
              <span class="recap-q-text">{{ q.text }}</span>
              <span class="recap-q-chip" :class="`recap-q-chip--${state.answers[q.id]?.value}`">
                {{ answerLabel(state.answers[q.id]?.value) }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- CTA -->
      <div class="recap-cta">
        <DsfrButton
          label="Voir mes résultats"
          icon="ri-bar-chart-2-line"
          size="lg"
          class="recap-cta__btn"
          @click="goToResults"
        />
        <p class="recap-cta__note">
          <i class="ri-shield-check-line" aria-hidden="true"></i>
          {{ totalAnswered }} réponse{{ totalAnswered !== 1 ? 's' : '' }} enregistrée{{
            totalAnswered !== 1 ? 's' : ''
          }}
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionnaire } from '@/composables/useQuestionnaire.js'
import AppHeader from '@/components/AppHeader.vue'
import { sectionIconMap, answerLabel } from '@/data/sections.js'

const router = useRouter()
const { state, allQuestions } = useQuestionnaire()

// Only show questions that were actually answered (skip branched-over ones)
const sections = computed(() => {
  const result = []
  let current = null

  for (const q of allQuestions.value) {
    if (!state.answers[q.id]) continue

    if (!current || current.name !== q.section) {
      current = { name: q.section, questions: [] }
      result.push(current)
    }
    current.questions.push(q)
  }
  return result
})

const totalAnswered = computed(() => Object.keys(state.answers).length)

function editSection(sectionName) {
  router.push({ name: 'questionnaire', query: { editSection: sectionName } })
}

function goToResults() {
  router.push('/resultat')
}
</script>

<style scoped>
.recap-page {
  min-height: 100vh;
  background: var(--c-bg-app);
}

.recap-main {
  max-width: 760px;
  margin: 0 auto;
  padding: 2rem 1rem 5rem;
}

/* ── Hero ─────────────────────────────────────── */
.recap-hero {
  text-align: center;
  margin-bottom: 2.5rem;
}
.recap-hero__icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--c-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #fff;
  font-size: 1.75rem;
}
.recap-hero__title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--c-text-title);
  margin: 0 0 0.5rem;
}
.recap-hero__sub {
  font-size: 0.95rem;
  color: #555;
  margin: 0;
  line-height: 1.6;
}

/* ── Sections ─────────────────────────────────── */
.recap-sections {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.recap-section {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.recap-section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f0f0f8;
  background: #fafafe;
}

.recap-section__title-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.recap-section__title-row i {
  font-size: 1.2rem;
  color: var(--c-brand);
  flex-shrink: 0;
}
.recap-section__title-row h2 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-text-title);
  margin: 0;
}

.recap-edit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.85rem;
  border-radius: 6px;
  border: 1.5px solid var(--c-brand);
  background: transparent;
  color: var(--c-brand);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  flex-shrink: 0;
}
.recap-edit-btn i {
  font-size: 0.9rem;
}
.recap-edit-btn:hover,
.recap-edit-btn:focus-visible {
  background: var(--c-brand);
  color: #fff;
  outline: none;
}

/* ── Questions list ───────────────────────────── */
.recap-q-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.recap-q-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid #f4f4f8;
  font-size: 0.875rem;
}
.recap-q-item:last-child {
  border-bottom: none;
}

.recap-q-text {
  flex: 1;
  color: #444;
  line-height: 1.5;
}

.recap-q-chip {
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: 10px;
  white-space: nowrap;
}
.recap-q-chip--oui {
  background: var(--c-level-excellent-bg);
  color: var(--c-level-excellent-dark);
}
.recap-q-chip--non {
  background: var(--c-level-faible-bg);
  color: var(--c-level-faible-dark);
}
.recap-q-chip--sais_pas {
  background: var(--c-neutral-bg);
  color: var(--c-brand);
}

/* ── CTA ──────────────────────────────────────── */
.recap-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.5rem;
}
.recap-cta__btn {
  justify-content: center;
  min-width: 260px;
}
.recap-cta__note {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: #666;
  margin: 0;
}
.recap-cta__note i {
  color: var(--c-level-excellent);
}

/* ── Responsive ───────────────────────────────── */
@media (max-width: 520px) {
  .recap-section__head {
    flex-wrap: wrap;
  }
  .recap-cta__btn {
    min-width: unset;
    max-width: 100%;
  }
  .recap-q-item {
    font-size: 0.82rem;
  }
}
</style>
