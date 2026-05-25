<template>
  <div class="home-page">
    <!-- ===== HERO ===== -->
    <div class="hero">
      <div class="hero__shape hero__shape--1" aria-hidden="true"></div>
      <div class="hero__shape hero__shape--2" aria-hidden="true"></div>
      <div class="hero__content fr-container">
        <img
          src="/images/logo-cptm.png"
          alt="Logo Prévention Sûreté — Gendarmerie Nationale"
          class="hero__logo"
        />
        <div class="hero__titles">
          <p class="hero__supra">Gendarmerie Nationale</p>
          <h1 class="hero__h1">
            Auto-diagnostic<br />
            <span class="hero__accent">Sûreté Habitation</span>
          </h1>
          <p class="hero__cptm">Cellule de Prévention Technique de la Malveillance</p>
        </div>
      </div>
    </div>

    <!-- ===== TRICOLOR ===== -->
    <div class="tricolor" aria-hidden="true">
      <span class="tricolor__blue"></span>
      <span class="tricolor__white"></span>
      <span class="tricolor__red"></span>
    </div>

    <!-- ===== MAIN ===== -->
    <main id="main-content" class="home-main">
      <div class="home-content fr-container">
        <!-- Intro card -->
        <div class="intro-card">
          <div class="intro-card__body">
            <div class="intro-card__text-col">
              <h2 class="intro-card__title">Évaluez la sûreté de votre habitation</h2>
              <p class="intro-card__text">
                Ce questionnaire, proposé par la <strong>Gendarmerie Nationale</strong>, vous permet
                d'identifier les points forts et les axes d'amélioration de la sécurité de votre
                domicile à travers un auto-diagnostic guidé et confidentiel.
              </p>
            </div>
            <div class="intro-card__video-col">
              <video
                class="intro-video"
                autoplay
                muted
                loop
                playsinline
                preload="none"
                aria-hidden="true"
              >
                <source :src="`${BASE}images/geo.webm`" type="video/webm" />
              </video>
            </div>
          </div>
        </div>

        <!-- Metric blocks -->
        <div class="metrics">
          <div class="metric-item">
            <i class="ri-time-line" aria-hidden="true"></i>
            <div>
              <strong>5 à 8 minutes</strong>
              <span>Durée estimée</span>
            </div>
          </div>
          <div class="metric-item">
            <i class="ri-eye-off-line" aria-hidden="true"></i>
            <div>
              <strong>Aucune collecte</strong>
              <span>100 % anonyme</span>
            </div>
          </div>
          <div class="metric-item">
            <i class="ri-device-line" aria-hidden="true"></i>
            <div>
              <strong>Données locales</strong>
              <span>Sur votre appareil</span>
            </div>
          </div>
        </div>

        <!-- Privacy notice -->
        <div class="notice" role="note">
          <i class="ri-shield-check-line" aria-hidden="true"></i>
          <p>
            Ce questionnaire est confidentiel. Vos réponses restent uniquement sur votre appareil et
            ne sont transmises à aucun organisme.
          </p>
        </div>

        <!-- CTA -->
        <div class="cta-wrap">
          <DsfrButton
            label="Commencer le diagnostic"
            icon="ri-arrow-right-line"
            :icon-right="true"
            size="lg"
            class="cta-btn"
            @click="$router.push('/type')"
          />
        </div>

        <p class="legal">
          Initiative de la Gendarmerie Nationale · Dispositif
          <a :href="MASECURITE_HOME" target="_blank" rel="noopener noreferrer" class="fr-link"
            >MaSécurité</a
          >
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { MASECURITE_HOME } from '@/config/links.js'
const BASE = import.meta.env.BASE_URL
</script>

<style scoped>
/* ─── Page shell ─────────────────────────────────────────────── */
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #eeeeff;
}

/* ─── Hero ───────────────────────────────────────────────────── */
.hero {
  background: linear-gradient(145deg, var(--c-brand-darker) 0%, var(--c-brand) 55%, #1616a0 100%);
  padding: 3.5rem 0 3rem;
  position: relative;
  overflow: hidden;
}

.hero__shape {
  position: absolute;
  border-radius: 50%;
  background: #ffffff;
  opacity: 0.05;
  pointer-events: none;
}
.hero__shape--1 {
  width: 420px;
  height: 420px;
  top: -140px;
  right: -60px;
}
.hero__shape--2 {
  width: 260px;
  height: 260px;
  bottom: -80px;
  left: 3%;
}

.hero__content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2.25rem;
}

.hero__logo {
  width: 116px;
  height: 116px;
  object-fit: contain;
  flex-shrink: 0;
  filter: drop-shadow(0 4px 18px rgba(0, 0, 0, 0.45));
}

.hero__titles {
  color: #fff;
}

.hero__supra {
  margin: 0 0 0.3rem;
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.6;
  font-weight: 500;
}

.hero__h1 {
  margin: 0 0 0.5rem;
  font-size: clamp(1.7rem, 4.2vw, 2.6rem);
  font-weight: 800;
  line-height: 1.15;
  color: #fff;
}

.hero__accent {
  color: #ffd700;
}

.hero__cptm {
  margin: 0;
  font-size: 0.83rem;
  opacity: 0.75;
  font-style: italic;
}

/* ─── Tricolor ───────────────────────────────────────────────── */
.tricolor {
  display: flex;
  height: 5px;
  width: 100%;
}
.tricolor__blue {
  flex: 1;
  background: #002395;
}
.tricolor__white {
  flex: 1;
  background: #ffffff;
}
.tricolor__red {
  flex: 1;
  background: #ed2939;
}

/* ─── Main ───────────────────────────────────────────────────── */
.home-main {
  flex: 1;
  padding: 2.75rem 1rem 2rem;
}

.home-content {
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ─── Intro card ─────────────────────────────────────────────── */
.intro-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.75rem 2rem;
  border-top: 4px solid var(--c-brand);
  box-shadow: 0 2px 18px rgba(0, 0, 144, 0.08);
}

.intro-card__body {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.intro-card__text-col {
  flex: 1;
}

.intro-card__video-col {
  flex-shrink: 0;
  width: 180px;
}

.intro-video {
  width: 100%;
  aspect-ratio: 9 / 16;
  object-fit: cover;
  border-radius: 10px;
  display: block;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

@media (prefers-reduced-motion: reduce) {
  .intro-video {
    display: none;
  }
  .intro-card__video-col {
    display: none;
  }
}

.intro-card__title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--c-text-title);
  margin: 0 0 0.75rem;
}

.intro-card__text {
  color: #3a3a3a;
  line-height: 1.75;
  margin: 0;
  font-size: 0.97rem;
}

/* ─── Metrics ────────────────────────────────────────────────── */
.metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.875rem;
}

.metric-item {
  background: #fff;
  border-radius: 10px;
  padding: 1rem 1rem 1rem 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 2px 10px rgba(0, 0, 144, 0.06);
  border-bottom: 3px solid var(--c-bg-card-blue);
}

.metric-item i {
  font-size: 1.5rem;
  color: var(--c-brand);
  flex-shrink: 0;
}

.metric-item div {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.metric-item strong {
  font-size: 0.85rem;
  color: var(--c-text-title);
  font-weight: 700;
}

.metric-item span {
  font-size: 0.75rem;
  color: #777;
  margin-top: 0.1rem;
}

/* ─── Notice ─────────────────────────────────────────────────── */
.notice {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #e3f4e7;
  border-left: 4px solid var(--c-level-excellent);
  border-radius: 0 8px 8px 0;
  padding: 1rem 1.25rem;
  color: var(--c-level-excellent-dark);
  font-size: 0.875rem;
  line-height: 1.65;
}

.notice i {
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.05rem;
}

.notice p {
  margin: 0;
}

/* ─── CTA ────────────────────────────────────────────────────── */
.cta-wrap {
  display: flex;
  justify-content: center;
}

.cta-btn {
  min-width: 300px;
  gap: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.cta-btn i {
  font-size: 1.1rem;
}

/* ─── Legal ──────────────────────────────────────────────────── */
.legal {
  font-size: 0.78rem;
  color: #999;
  text-align: center;
  margin: 0;
}

/* ─── Responsive ─────────────────────────────────────────────── */
@media (max-width: 600px) {
  .hero__content {
    flex-direction: column;
    text-align: center;
    gap: 1.25rem;
  }

  .hero__logo {
    width: 88px;
    height: 88px;
  }

  .metrics {
    grid-template-columns: 1fr;
  }

  .intro-card {
    padding: 1.25rem;
  }

  .intro-card__body {
    flex-direction: column;
  }

  .intro-card__video-col {
    width: 100%;
  }

  .intro-video {
    aspect-ratio: 16 / 9;
    width: 100%;
  }

  .cta-btn {
    min-width: unset;
    width: 100%;
  }
}
</style>
