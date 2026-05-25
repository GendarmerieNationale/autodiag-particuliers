<template>
  <div class="reco-page">
    <AppHeader />

    <main id="main-content" class="fr-container reco-main">
      <div class="reco-header">
        <div class="reco-header__icon"><i class="ri-book-open-line"></i></div>
        <div>
          <h1 class="reco-header__title">Préconisations générales</h1>
          <p class="reco-header__sub">
            Conseils pratiques de la Gendarmerie Nationale pour sécuriser votre habitation
          </p>
        </div>
      </div>

      <div class="reco-grid">
        <div v-for="(section, idx) in recommendations" :key="idx" class="reco-card">
          <div class="reco-card__header">
            <span class="reco-card__icon"><i :class="section.icone"></i></span>
            <h2 class="reco-card__title">{{ section.titre }}</h2>
          </div>
          <ul class="reco-card__list">
            <li v-for="(item, i) in section.contenu" :key="i">
              <i class="ri-arrow-right-s-line"></i>
              <span v-if="isLink(item)">
                <a
                  :href="extractLink(item)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="fr-link"
                >
                  {{ stripLink(item) }}
                </a>
              </span>
              <span v-else>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- OTV Banner -->
      <div class="reco-otv-banner">
        <div class="reco-otv-banner__content">
          <span class="reco-otv-banner__icon"><i class="ri-police-car-line"></i></span>
          <div>
            <p class="reco-otv-banner__title">Opération Tranquillité Vacances (OTV)</p>
            <p class="reco-otv-banner__desc">
              Inscrivez-vous gratuitement auprès de votre brigade de gendarmerie pour que des
              patrouilles surveillent votre domicile pendant vos absences.
            </p>
          </div>
        </div>
        <a :href="OTV_URL" target="_blank" rel="noopener noreferrer" class="reco-otv-banner__btn">
          <i class="ri-external-link-line"></i>
          Accéder à MaSécurité
        </a>
      </div>

      <div class="reco-actions">
        <DsfrButton
          label="Retour aux résultats"
          icon="ri-arrow-left-line"
          :secondary="true"
          class="reco-action-btn"
          @click="$router.push('/resultat')"
        />
        <DsfrButton
          label="Nouveau diagnostic"
          icon="ri-restart-line"
          class="reco-action-btn"
          @click="restart"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useQuestionnaire } from '@/composables/useQuestionnaire.js'
import AppHeader from '@/components/AppHeader.vue'
import recommendations from '@/data/recommendations.json'
import { OTV_URL } from '@/config/links.js'

const router = useRouter()
const { reset } = useQuestionnaire()

function isLink(text) {
  return /https?:\/\//.test(text)
}

function extractLink(text) {
  const match = text.match(/https?:\/\/[^\s]+/)
  return match ? match[0] : '#'
}

function stripLink(text) {
  return text.replace(/https?:\/\/[^\s]+/, '').trim()
}

function restart() {
  reset()
  router.push('/')
}
</script>

<style scoped>
.reco-page {
  min-height: 100vh;
  background: var(--c-bg-app);
}

.reco-main {
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.reco-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.reco-header__icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: var(--c-brand);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  flex-shrink: 0;
}

.reco-header__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--c-text-title);
  margin: 0 0 0.25rem 0;
}

.reco-header__sub {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.reco-grid {
  display: grid;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.reco-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0, 0, 144, 0.08);
}

.reco-card__header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(90deg, var(--c-bg-card-blue), #fff);
  border-bottom: 1px solid #e0e0f0;
}

.reco-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--c-brand);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.reco-card__title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-text-title);
  margin: 0;
}

.reco-card__list {
  list-style: none;
  padding: 1.25rem 1.5rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.reco-card__list li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #333;
  line-height: 1.6;
}

.reco-card__list li i {
  color: var(--c-brand);
  flex-shrink: 0;
  margin-top: 0.2rem;
  font-size: 1rem;
}

/* OTV Banner */
.reco-otv-banner {
  background: linear-gradient(135deg, #16166a, var(--c-brand));
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  color: #fff;
}

.reco-otv-banner__content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.reco-otv-banner__icon {
  font-size: 2rem;
  flex-shrink: 0;
  opacity: 0.8;
}

.reco-otv-banner__title {
  font-weight: 700;
  font-size: 1rem;
  margin: 0 0 0.25rem 0;
}

.reco-otv-banner__desc {
  font-size: 0.875rem;
  opacity: 0.85;
  margin: 0;
  line-height: 1.5;
  max-width: 480px;
}

.reco-otv-banner__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #fff;
  color: var(--c-brand);
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s;
  margin-left: auto;
}

.reco-otv-banner__btn:hover {
  background: var(--c-bg-card-blue);
}

.reco-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.reco-action-btn {
  justify-content: center;
}

@media (max-width: 480px) {
  .reco-otv-banner {
    flex-direction: column;
  }
  .reco-otv-banner__btn {
    margin-left: 0;
  }
  .reco-actions {
    flex-direction: column;
  }
  .reco-action-btn {
    width: 100%;
  }
}
</style>
