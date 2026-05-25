<template>
  <div>
    <DsfrHeader
      :logo-text="['République', 'Française']"
      service-title="Auto-diagnostic Sûreté Habitation"
      service-description="Cellule de Prévention Technique de la Malveillance"
      :home-to="{ path: '/' }"
      :operator-img-src="logoSrc"
      operator-img-alt="Gendarmerie Nationale — Prévention Sûreté"
      :operator-img-style="{ width: '60px', height: '60px', objectFit: 'contain' }"
    />

    <div
      v-if="showProgress"
      class="questionnaire-progress"
      role="progressbar"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="`Progression : ${progress}%`"
    >
      <div class="fr-container questionnaire-progress__inner">
        <i class="ri-folder-open-line questionnaire-progress__icon" aria-hidden="true"></i>
        <span class="questionnaire-progress__section">{{ section }}</span>
        <div class="questionnaire-progress__bar">
          <div class="questionnaire-progress__fill" :style="{ width: progress + '%' }"></div>
        </div>
        <span class="questionnaire-progress__pct">{{ progress }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  showProgress: { type: Boolean, default: false },
  progress: { type: Number, default: 0 },
  section: { type: String, default: '' },
})

const logoSrc = `${import.meta.env.BASE_URL}images/logo-cptm.png`
</script>

<style scoped>
.questionnaire-progress {
  background: var(--blue-france-sun-113-625);
  padding: 0.5rem 0;
}

.questionnaire-progress__inner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.questionnaire-progress__icon {
  color: var(--text-inverted-grey);
  opacity: 0.8;
  flex-shrink: 0;
}

.questionnaire-progress__section {
  font-size: 0.78rem;
  color: var(--text-inverted-grey);
  opacity: 0.8;
  white-space: nowrap;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.questionnaire-progress__bar {
  flex: 1;
  height: 7px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 4px;
  overflow: hidden;
}

.questionnaire-progress__fill {
  height: 100%;
  background: var(--text-inverted-grey);
  border-radius: 4px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.questionnaire-progress__pct {
  font-size: 0.78rem;
  color: var(--text-inverted-grey);
  font-weight: 600;
  white-space: nowrap;
}

@media (max-width: 480px) {
  .questionnaire-progress__section {
    display: none;
  }
}
</style>
