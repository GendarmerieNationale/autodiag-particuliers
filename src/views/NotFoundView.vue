<template>
  <div class="nf-page">
    <AppHeader />
    <main id="main-content" class="nf-main">
      <div class="nf-card">
        <div class="nf-card__icon"><i class="ri-compass-line" aria-hidden="true"></i></div>
        <p class="nf-card__code">404</p>
        <h1 class="nf-card__title">Page introuvable</h1>
        <p class="nf-card__desc">
          La page demandée n'existe pas ou a été déplacée. Vous pouvez retourner à l'accueil pour
          démarrer un nouveau diagnostic.
        </p>
        <DsfrButton
          label="Retour à l'accueil"
          icon="ri-home-4-line"
          class="nf-card__btn"
          @click="$router.push('/')"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
</script>

<style scoped>
.nf-page {
  min-height: 100vh;
  background: var(--c-bg-app);
}

.nf-main {
  max-width: 560px;
  margin: 0 auto;
  padding: 3rem 1rem;
}

.nf-card {
  background: #fff;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  text-align: center;
  border-top: 4px solid var(--c-brand);
  box-shadow: 0 4px 24px rgba(0, 0, 144, 0.1);
}

.nf-card__icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--c-brand);
  color: #fff;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.nf-card__code {
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  color: #888;
  font-weight: 700;
  margin: 0 0 0.25rem;
}

.nf-card__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--c-text-title);
  margin: 0 0 0.75rem;
}

.nf-card__desc {
  color: #555;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 1.5rem;
}

.nf-card__btn {
  justify-content: center;
  min-width: 220px;
}
</style>
