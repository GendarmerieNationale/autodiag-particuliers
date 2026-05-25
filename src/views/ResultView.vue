<template>
  <div class="result-page">
    <AppHeader />

    <main id="main-content" class="fr-container result-main">
      <!-- Score display -->
      <div class="result-hero" :class="`result-hero--${level}`">
        <div class="result-hero__mascot">
          <div class="mascot" :class="`mascot--${level}`">
            <img :src="mascotSrc" :alt="`Mascotte ${level}`" class="mascot__img" />
          </div>
        </div>

        <div class="result-hero__content">
          <div class="result-hero__label">Votre score</div>
          <div class="result-hero__score">
            <span class="result-score-num">{{ score }}</span>
            <span class="result-score-total">/ {{ totalPossible }}</span>
          </div>
          <div class="result-hero__pct">
            <div class="result-pct-bar">
              <div
                class="result-pct-fill"
                :style="{ width: scorePct + '%' }"
                :class="`result-pct-fill--${level}`"
              ></div>
            </div>
            <span class="result-pct-label">{{ scorePct }}%</span>
          </div>
          <h1 class="result-hero__title">{{ resultMessage.title }}</h1>
          <p class="result-hero__desc">{{ resultMessage.desc }}</p>
        </div>
      </div>

      <!-- Badges won -->
      <div v-if="sectionBadges.length" class="result-badges">
        <h2 class="result-section-title"><i class="ri-award-line"></i> Sections complétées</h2>
        <div class="badges-row">
          <div v-for="badge in sectionBadges" :key="badge" class="badge-item">
            <i class="ri-checkbox-circle-fill"></i>
            <span>{{ badge }}</span>
          </div>
        </div>
      </div>

      <!-- CTA contact if score faible -->
      <div v-if="level === 'faible'" class="result-contact-cta">
        <div class="contact-cta-icon"><i class="ri-customer-service-2-line"></i></div>
        <div>
          <p class="contact-cta-title">Besoin d'accompagnement ?</p>
          <p class="contact-cta-desc">
            Votre niveau de sécurité est insuffisant. Nous vous invitons à vous rapprocher de votre
            brigade de gendarmerie pour un accompagnement personnalisé.
          </p>
          <a
            :href="MASECURITE_BRIGADE_FINDER"
            target="_blank"
            rel="noopener noreferrer"
            class="fr-link"
            style="display: block; margin-bottom: 0.4rem"
          >
            Trouver ma brigade
          </a>
          <a :href="MASECURITE_HOME" target="_blank" rel="noopener noreferrer" class="fr-link">
            Accéder à MaSécurité
          </a>
        </div>
      </div>

      <!-- Actions -->
      <div class="result-actions">
        <DsfrButton
          :label="isGenerating ? 'Génération en cours…' : 'Télécharger mon diagnostic (PDF)'"
          :icon="isGenerating ? 'ri-loader-4-line' : 'ri-download-2-line'"
          :disabled="isGenerating"
          class="result-action-btn"
          @click="downloadDiagnostic"
        />
        <DsfrButton
          label="Voir les préconisations"
          icon="ri-book-open-line"
          :icon-right="true"
          class="result-action-btn"
          @click="$router.push('/preconisations')"
        />
        <DsfrButton
          label="Recommencer le diagnostic"
          icon="ri-restart-line"
          :secondary="true"
          class="result-action-btn"
          @click="restart"
        />
        <DsfrButton
          label="Opération Tranquillité Vacances"
          icon="ri-external-link-line"
          :icon-right="true"
          :secondary="true"
          class="result-action-btn"
          @click="openOTV"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionnaire } from '@/composables/useQuestionnaire.js'
import AppHeader from '@/components/AppHeader.vue'
import { generateDiagnosticPdf } from '@/services/pdf.js'
import { MASECURITE_HOME, MASECURITE_BRIGADE_FINDER, OTV_URL } from '@/config/links.js'

const router = useRouter()
const { state, score, totalPossible, scorePct, scoreLevel, allQuestions, reset } =
  useQuestionnaire()
const isGenerating = ref(false)

onMounted(() => {
  if (!state.finished) {
    router.replace('/')
  }
})

const level = computed(() => scoreLevel.value)
const sectionBadges = computed(() => state.sectionBadges)

const mascotSrc = computed(() => `${import.meta.env.BASE_URL}images/mascotte-${level.value}.png`)

const resultMessages = {
  excellent: {
    title: 'Excellent ! Votre habitation est bien sécurisée.',
    desc: 'Vous avez adopté les bonnes pratiques. Consultez les préconisations pour maintenir ce niveau de sûreté et découvrir les dernières recommandations.',
  },
  moyen: {
    title: 'Des améliorations sont possibles.',
    desc: 'Vous avez de bonnes bases, mais certains points méritent attention. Consultez les préconisations générales pour renforcer votre sécurité.',
  },
  faible: {
    title: 'Attention, votre habitation est vulnérable.',
    desc: 'Des actions sont urgentes pour sécuriser votre domicile. Nous vous invitons à consulter les préconisations et à contacter un correspondant sûreté.',
  },
}

const resultMessage = computed(() => resultMessages[level.value])

function openOTV() {
  window.open(OTV_URL, '_blank', 'noopener,noreferrer')
}

function restart() {
  reset()
  router.push('/')
}

async function downloadDiagnostic() {
  if (isGenerating.value) return
  isGenerating.value = true
  try {
    await generateDiagnosticPdf({
      state,
      allQuestions: allQuestions.value,
      level: level.value,
    })
  } catch (e) {
    console.error('Erreur génération PDF:', e)
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
.result-page {
  min-height: 100vh;
  background: var(--c-bg-app);
}

.result-main {
  padding: 2rem 1rem;
  max-width: 680px;
  margin: 0 auto;
}

/* Hero */
.result-hero {
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 144, 0.1);
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  border-top: 4px solid var(--c-brand);
}

.result-hero--excellent {
  border-top-color: var(--c-level-excellent);
}
.result-hero--moyen {
  border-top-color: var(--c-level-moyen);
}
.result-hero--faible {
  border-top-color: var(--c-level-faible);
}

.result-hero__mascot {
  flex-shrink: 0;
}

.mascot {
  width: 110px;
  height: 110px;
  flex-shrink: 0;
  animation: bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.mascot__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.result-hero__content {
  flex: 1;
}

.result-hero__label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 0.25rem;
}

.result-hero__score {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.result-score-num {
  font-size: 3rem;
  font-weight: 800;
  color: var(--c-brand);
  animation: countUp 0.8s ease;
}

.result-score-total {
  font-size: 1.25rem;
  color: #aaa;
}

.result-hero__pct {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.result-pct-bar {
  flex: 1;
  height: 8px;
  background: #e0e0f0;
  border-radius: 4px;
  overflow: hidden;
}

.result-pct-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.result-pct-fill--excellent {
  background: linear-gradient(90deg, var(--c-level-excellent), #099a3d);
}
.result-pct-fill--moyen {
  background: linear-gradient(90deg, #e46a26, var(--c-level-moyen));
}
.result-pct-fill--faible {
  background: linear-gradient(90deg, #e1000f, var(--c-level-faible));
}

.result-pct-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #555;
  white-space: nowrap;
}

.result-hero__title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--c-text-title);
  margin: 0 0 0.5rem 0;
}

.result-hero__desc {
  font-size: 0.9rem;
  color: #555;
  margin: 0;
  line-height: 1.6;
}

/* Badges */
.result-badges {
  background: #fff;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 144, 0.07);
}

.result-section-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-text-title);
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.result-section-title i {
  color: var(--c-brand);
}

.badges-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.badge-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: var(--c-level-excellent-bg);
  color: var(--c-level-excellent-dark);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.4rem 0.875rem;
  border-radius: 20px;
}

.badge-item i {
  font-size: 1rem;
}

/* Actions */
.result-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.result-action-btn {
  width: 100%;
  justify-content: center;
}

/* Contact CTA */
.result-contact-cta {
  background: linear-gradient(135deg, #fff4e0, #fff8ec);
  border: 1px solid #f6c87e;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.contact-cta-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #fff3cd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: var(--c-level-moyen);
  flex-shrink: 0;
}

.contact-cta-title {
  font-weight: 700;
  font-size: 1rem;
  color: var(--c-text-title);
  margin: 0 0 0.25rem 0;
}

.contact-cta-desc {
  font-size: 0.875rem;
  color: #555;
  margin: 0 0 0.5rem 0;
}

@keyframes bounceIn {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .result-hero {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .result-hero__pct {
    justify-content: center;
  }
}
</style>
