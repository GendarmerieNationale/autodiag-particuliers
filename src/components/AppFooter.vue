<template>
  <footer class="app-footer">
    <div class="fr-container">
      <p>© {{ year }} Gendarmerie Nationale · Cellule de Prévention Technique de la Malveillance</p>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.app-footer {
  background: var(--c-brand-darker);
  color: rgba(255, 255, 255, 0.45);
  text-align: center;
  padding: 1.1rem 1rem;
}

.app-footer p {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.4;
}

@media (max-width: 48em) {
  .app-footer {
    padding: 0.8rem 0.75rem;
  }
  .app-footer p {
    font-size: 0.65rem;
    line-height: 1.35;
  }
}
</style>
