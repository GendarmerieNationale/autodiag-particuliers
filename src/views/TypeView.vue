<template>
  <div class="type-page">
    <AppHeader />

    <main id="main-content" class="fr-container type-main">
      <div class="type-card">
        <p class="type-card__step fr-badge fr-badge--info fr-badge--no-icon">
          Étape 1 sur 2 · Localisation
        </p>
        <h2 class="fr-h2 type-card__title">Quel type de logement avez-vous ?</h2>
        <p class="fr-text--lg type-card__desc">
          Sélectionnez votre situation pour commencer le questionnaire adapté.
        </p>

        <!-- Logement type — rich card choices -->
        <div class="type-choices">
          <button
            v-for="option in logementOptions"
            :key="option.value"
            class="type-choice"
            :class="{ 'type-choice--selected': selectedType === option.value }"
            :aria-pressed="selectedType === option.value"
            @click="select(option.value)"
          >
            <VIcon :name="option.icon" class="type-choice__icon" aria-hidden="true" />
            <span class="type-choice__label">{{ option.label }}</span>
            <span class="type-choice__desc">{{ option.desc }}</span>
          </button>
        </div>

        <Transition name="slide-up">
          <div v-if="selectedType" class="type-localisation">
            <!-- Localisation — icon card choices -->
            <p class="type-loc__legend">Situation géographique</p>
            <div class="type-choices type-choices--loc">
              <button
                v-for="loc in localisationOptions"
                :key="loc.value"
                class="type-choice"
                :class="{ 'type-choice--selected': selectedLocalisation === loc.value }"
                :aria-pressed="selectedLocalisation === loc.value"
                @click="selectedLocalisation = loc.value"
              >
                <VIcon :name="loc.icon" class="type-choice__icon" aria-hidden="true" />
                <span class="type-choice__label">{{ loc.label }}</span>
              </button>
            </div>

            <!-- Oui/Non questions — only after localisation selected -->
            <Transition name="slide-up">
              <div v-if="selectedLocalisation" class="type-loc__questions">
                <DsfrRadioButtonSet
                  v-model="eclairage"
                  :options="ouiNonOptions"
                  :inline="true"
                  name="eclairage"
                >
                  <template #legend>
                    <span class="type-loc__q-legend">
                      <VIcon name="ri-lightbulb-line" aria-hidden="true" />
                      La rue est-elle équipée d'un éclairage public ?
                    </span>
                  </template>
                </DsfrRadioButtonSet>

                <DsfrRadioButtonSet
                  v-model="videoprotection"
                  :options="ouiNonOptions"
                  :inline="true"
                  name="videoprotection"
                >
                  <template #legend>
                    <span class="type-loc__q-legend">
                      <VIcon name="ri-camera-line" aria-hidden="true" />
                      La commune est-elle équipée de vidéo-protection ?
                    </span>
                  </template>
                </DsfrRadioButtonSet>

                <DsfrButton
                  label="Continuer le questionnaire"
                  icon="ri-arrow-right-line"
                  :icon-right="true"
                  size="lg"
                  :disabled="!canContinue"
                  class="type-cta"
                  @click="continuer"
                />
              </div>
            </Transition>
          </div>
        </Transition>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionnaire } from '@/composables/useQuestionnaire.js'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()
const { setLogementType, setLocalisation, answer } = useQuestionnaire()

const selectedType = ref(null)
const selectedLocalisation = ref(null)
const eclairage = ref(null)
const videoprotection = ref(null)

const logementOptions = [
  {
    value: 'maison',
    label: 'Maison individuelle',
    icon: 'ri-home-2-line',
    desc: 'Maison avec ou sans jardin',
  },
  {
    value: 'appartement',
    label: 'Appartement',
    icon: 'ri-building-2-line',
    desc: 'En immeuble collectif',
  },
]

const localisationOptions = [
  { value: 'ville', label: 'Ville', icon: 'ri-building-4-line' },
  { value: 'petite_commune', label: 'Petite commune', icon: 'ri-community-line' },
  { value: 'campagne', label: 'Campagne', icon: 'ri-tree-line' },
  { value: 'lotissement', label: 'Lotissement', icon: 'ri-layout-grid-line' },
]

const ouiNonOptions = [
  { value: 'oui', label: 'Oui' },
  { value: 'non', label: 'Non' },
]

const canContinue = computed(
  () => selectedLocalisation.value && eclairage.value && videoprotection.value
)

function select(type) {
  selectedType.value = type
}

function continuer() {
  setLogementType(selectedType.value)
  setLocalisation(selectedLocalisation.value)
  answer(
    'type_eclairage',
    eclairage.value,
    eclairage.value === 'oui' ? 1 : 0,
    `Éclairage public : ${eclairage.value}`
  )
  answer(
    'type_videoprotection',
    videoprotection.value,
    videoprotection.value === 'oui' ? 1 : 0,
    `Vidéo-protection : ${videoprotection.value}`
  )
  router.push('/questionnaire')
}
</script>

<style scoped>
.type-page {
  min-height: 100vh;
  background: var(--background-alt-blue-france);
}

.type-main {
  padding: 2rem 1rem;
  max-width: 700px;
  margin: 0 auto;
}

.type-card {
  background: var(--background-default-grey);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 144, 0.1);
  border-top: 4px solid var(--blue-france-sun-113-625);
}

.type-card__step {
  margin-bottom: 0.75rem;
}

.type-card__title {
  margin: 0 0 0.5rem;
}

.type-card__desc {
  color: var(--text-mention-grey);
  margin: 0 0 1.5rem;
}

/* Logement type — rich card choices */
.type-choices {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.type-choice {
  flex: 1;
  min-width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 1.25rem 1rem;
  border: 2px solid var(--border-default-grey);
  border-radius: 12px;
  background: var(--background-default-grey);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  font-family: inherit;
}

.type-choice:hover {
  border-color: var(--blue-france-sun-113-625);
  background: var(--background-alt-blue-france);
}

.type-choice--selected {
  border-color: var(--blue-france-sun-113-625);
  background: var(--background-alt-blue-france);
  box-shadow: 0 0 0 3px rgba(0, 0, 145, 0.15);
}

.type-choice__icon {
  font-size: 1.75rem;
  color: var(--blue-france-sun-113-625);
}

.type-choice__label {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-title-grey);
}

.type-choice__desc {
  font-size: 0.8rem;
  color: var(--text-mention-grey);
}

/* Localisation + Questions */
.type-localisation {
  border-top: 1px solid var(--border-default-grey);
  padding-top: 1.5rem;
}

.type-loc__legend {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-title-grey);
  margin: 0 0 0.75rem;
}

.type-choices--loc {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 1.5rem;
}

.type-choices--loc .type-choice {
  min-width: 0;
}

@media (max-width: 480px) {
  .type-choices--loc {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.type-loc__questions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.type-loc__q-legend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-title-grey);
}

.type-cta {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.35s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.slide-up-leave-to {
  opacity: 0;
}
</style>
