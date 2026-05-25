// PDF generation for the security diagnostic.
// Kept out of ResultView.vue so the view stays focused on rendering and so this
// can be unit-tested or swapped (e.g. server-side rendering) without touching UI.

import conseils from '@/data/conseils.json'
import recommendations from '@/data/recommendations.json'
import { MASECURITE_HOME } from '@/config/links.js'

const FONT_NAME = 'helvetica'
const PAGE_MARGIN_MM = 14
const CONTENT_WIDTH_MM = 182 // 210 (A4) - 2 * margin
const PAGE_HEIGHT_MM = 297

const LOGEMENT_LABELS = {
  maison: 'Maison individuelle',
  appartement: 'Appartement',
}

const LOCALISATION_LABELS = {
  ville: 'Ville',
  petite_commune: 'Petite commune',
  campagne: 'Campagne',
  lotissement: 'Lotissement',
}

const LEVEL_LABELS = {
  excellent: 'Bonne sécurité',
  moyen: 'Sécurité moyenne',
  faible: 'Sécurité insuffisante',
}

const LEVEL_RGB = {
  excellent: [31, 141, 73],
  moyen: [179, 64, 0],
  faible: [206, 5, 0],
}

const TYPE_QUESTION_TEXTS = {
  type_eclairage: 'Éclairage public dans la rue',
  type_videoprotection: 'Vidéo-protection dans la commune',
}

const answerLabel = v => (v === 'oui' ? 'Oui' : v === 'non' ? 'Non' : 'Je ne sais pas')

async function fetchAsBase64(url) {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    return await new Promise(resolve => {
      const fr = new FileReader()
      fr.onload = () => resolve(fr.result)
      fr.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

async function getImageDimensions(b64) {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
    img.onerror = () => resolve({ w: 200, h: 80 })
    img.src = b64
  })
}

/**
 * Build and trigger download of the diagnostic PDF.
 *
 * @param {Object}   params
 * @param {Object}   params.state           Questionnaire state ({ logementType, localisation, answers }).
 * @param {Array}    params.allQuestions    Questions of the current logement type.
 * @param {string}   params.level           'excellent' | 'moyen' | 'faible'
 * @returns {Promise<void>}                 Resolves after `doc.save()` is called.
 */
export async function generateDiagnosticPdf({ state, allQuestions, level }) {
  const { jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const date = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const logementLabel = LOGEMENT_LABELS[state.logementType] || '—'
  const locLabel = LOCALISATION_LABELS[state.localisation] || '—'
  const levelLabel = LEVEL_LABELS[level] || '—'
  const levelRgb = LEVEL_RGB[level] || [0, 0, 145]

  const imagesBase = `${window.location.origin}${import.meta.env.BASE_URL}images/`
  const [logoB64, mascotB64, sigB64] = await Promise.all([
    fetchAsBase64(imagesBase + 'logo-cptm.png'),
    fetchAsBase64(imagesBase + `mascotte-${level}.png`),
    fetchAsBase64(imagesBase + 'signature.png'),
  ])

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  const M = PAGE_MARGIN_MM
  const W = CONTENT_WIDTH_MM
  const PH = PAGE_HEIGHT_MM

  let y = 0
  function ensureSpace(needed = 20) {
    if (y + needed > PH - M - 12) {
      doc.addPage()
      y = M
    }
  }

  // ── HEADER ───────────────────────────────────────────────────
  doc.setFillColor(0, 0, 145)
  doc.rect(0, 0, 210, 26, 'F')
  if (logoB64) doc.addImage(logoB64, 'PNG', M, 3, 18, 18)
  const txX = logoB64 ? M + 22 : M
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(6.5)
  doc.setFont(FONT_NAME, 'normal')
  doc.text('GENDARMERIE NATIONALE · PRÉVENTION TECHNIQUE DE LA MALVEILLANCE', txX, 8.5)
  doc.setFontSize(15)
  doc.setFont(FONT_NAME, 'bold')
  doc.text('Auto-diagnostic Sûreté Habitation', txX, 16)
  doc.setFontSize(7.5)
  doc.setFont(FONT_NAME, 'normal')
  doc.text(`Réalisé le ${date} — Document confidentiel`, txX, 22)
  y = 32

  // ── INFO ROW (3 cells) ───────────────────────────────────────
  const bW = W / 3
  const bH = 18
  // Cell 1
  doc.setFillColor(245, 245, 254)
  doc.setDrawColor(220, 220, 240)
  doc.rect(M, y, bW, bH, 'FD')
  doc.setTextColor(130, 130, 160)
  doc.setFontSize(6.5)
  doc.setFont(FONT_NAME, 'normal')
  doc.text('LOGEMENT', M + 3, y + 5)
  doc.setTextColor(22, 22, 22)
  doc.setFontSize(10)
  doc.setFont(FONT_NAME, 'bold')
  doc.text(logementLabel, M + 3, y + 13)
  // Cell 2
  doc.setFillColor(245, 245, 254)
  doc.setDrawColor(220, 220, 240)
  doc.rect(M + bW, y, bW, bH, 'FD')
  doc.setTextColor(130, 130, 160)
  doc.setFontSize(6.5)
  doc.setFont(FONT_NAME, 'normal')
  doc.text('LOCALISATION', M + bW + 3, y + 5)
  doc.setTextColor(22, 22, 22)
  doc.setFontSize(10)
  doc.setFont(FONT_NAME, 'bold')
  doc.text(locLabel, M + bW + 3, y + 13)
  // Cell 3 (niveau — colored)
  doc.setFillColor(levelRgb[0], levelRgb[1], levelRgb[2])
  doc.rect(M + bW * 2, y, bW, bH, 'F')
  if (mascotB64) doc.addImage(mascotB64, 'PNG', M + bW * 2 + 2, y + 1, 13, 13)
  const lvlTxX = mascotB64 ? M + bW * 2 + 17 : M + bW * 2 + 3
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(6.5)
  doc.setFont(FONT_NAME, 'normal')
  doc.text('NIVEAU DE SÉCURITÉ', lvlTxX, y + 6)
  doc.setFontSize(9)
  doc.setFont(FONT_NAME, 'bold')
  doc.text(levelLabel, lvlTxX, y + 13)
  y += bH + 8

  // ── COLLECT DATA ─────────────────────────────────────────────
  const personalRecs = []
  ;['type_eclairage', 'type_videoprotection'].forEach(id => {
    const ans = state.answers[id]
    if (ans && ans.points === 0 && conseils[id])
      personalRecs.push({ section: 'Infos générales', conseil: conseils[id] })
  })

  const bySection = {}
  const sectionOrder = []
  const eclairage = state.answers['type_eclairage']
  const video = state.answers['type_videoprotection']
  if (eclairage || video) {
    bySection['Informations générales'] = []
    sectionOrder.push('Informations générales')
    if (eclairage)
      bySection['Informations générales'].push({
        text: TYPE_QUESTION_TEXTS.type_eclairage,
        value: eclairage.value,
        points: eclairage.points,
      })
    if (video)
      bySection['Informations générales'].push({
        text: TYPE_QUESTION_TEXTS.type_videoprotection,
        value: video.value,
        points: video.points,
      })
  }
  allQuestions.forEach(q => {
    const ans = state.answers[q.id]
    if (!ans) return
    if (!bySection[q.section]) {
      bySection[q.section] = []
      sectionOrder.push(q.section)
    }
    bySection[q.section].push({ text: q.text, value: ans.value, points: ans.points })
    if (ans.points === 0 && conseils[q.id])
      personalRecs.push({ section: q.section, conseil: conseils[q.id] })
  })

  // ── PERSONAL RECS ────────────────────────────────────────────
  ensureSpace(18)
  doc.setFillColor(252, 233, 233)
  doc.setDrawColor(206, 5, 0)
  doc.setLineWidth(0.4)
  doc.rect(M, y, W, 7, 'F')
  doc.line(M, y, M, y + 7)
  doc.setLineWidth(0.2)
  doc.setTextColor(141, 0, 0)
  doc.setFontSize(9.5)
  doc.setFont(FONT_NAME, 'bold')
  doc.text("Vos axes d'amélioration personnalisés", M + 4, y + 5)
  y += 8

  if (personalRecs.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Section', 'Conseil']],
      body: personalRecs.map(r => [r.section, r.conseil]),
      theme: 'plain',
      headStyles: {
        fillColor: [252, 233, 233],
        textColor: [141, 0, 0],
        fontSize: 7.5,
        fontStyle: 'bold',
        font: FONT_NAME,
      },
      columnStyles: {
        0: {
          cellWidth: 36,
          fontSize: 8,
          textColor: [141, 0, 0],
          fontStyle: 'bold',
          overflow: 'linebreak',
        },
        1: { fontSize: 8, overflow: 'linebreak' },
      },
      styles: {
        lineColor: [245, 225, 225],
        lineWidth: 0.25,
        overflow: 'linebreak',
        font: FONT_NAME,
      },
      tableWidth: W,
      margin: { left: M, right: M },
    })
    y = doc.lastAutoTable.finalY + 8
  } else {
    doc.setTextColor(31, 141, 73)
    doc.setFontSize(9)
    doc.setFont(FONT_NAME, 'bold')
    doc.text("Aucun axe d'amélioration — Excellent niveau de sécurité !", M, y + 4)
    y += 12
  }

  // ── ANSWERS BY SECTION ───────────────────────────────────────
  ensureSpace(15)
  doc.setFillColor(240, 240, 255)
  doc.setDrawColor(0, 0, 145)
  doc.setLineWidth(0.4)
  doc.rect(M, y, W, 7, 'F')
  doc.line(M, y, M, y + 7)
  doc.setLineWidth(0.2)
  doc.setTextColor(0, 0, 145)
  doc.setFontSize(9.5)
  doc.setFont(FONT_NAME, 'bold')
  doc.text('Vos réponses par section', M + 4, y + 5)
  y += 8

  for (const sec of sectionOrder) {
    ensureSpace(20)
    autoTable(doc, {
      startY: y,
      head: [
        [
          {
            content: sec,
            colSpan: 2,
            styles: {
              fillColor: [240, 240, 255],
              textColor: [0, 0, 145],
              fontStyle: 'bold',
              fontSize: 8.5,
            },
          },
        ],
      ],
      body: bySection[sec].map(item => {
        const missed = item.points === 0
        const ansC =
          item.value === 'oui' ? [26, 92, 51] : item.value === 'non' ? [141, 0, 0] : [90, 90, 150]
        return [
          {
            content: item.text,
            styles: {
              textColor: missed ? [107, 51, 0] : [50, 50, 50],
              fontStyle: missed ? 'bold' : 'normal',
              fillColor: missed ? [255, 244, 229] : [255, 255, 255],
              fontSize: 8,
            },
          },
          {
            content: answerLabel(item.value),
            styles: {
              textColor: ansC,
              fontStyle: 'bold',
              fillColor: missed ? [255, 244, 229] : [255, 255, 255],
              halign: 'center',
              fontSize: 8,
            },
          },
        ]
      }),
      columnStyles: { 0: { overflow: 'linebreak' }, 1: { cellWidth: 28, halign: 'center' } },
      styles: {
        lineColor: [220, 220, 235],
        lineWidth: 0.25,
        overflow: 'linebreak',
        font: FONT_NAME,
      },
      tableWidth: W,
      margin: { left: M, right: M },
    })
    y = doc.lastAutoTable.finalY + 4
  }
  y += 4

  // ── GENERAL RECOMMENDATIONS ──────────────────────────────────
  ensureSpace(15)
  doc.setFillColor(240, 240, 255)
  doc.setDrawColor(0, 0, 145)
  doc.setLineWidth(0.4)
  doc.rect(M, y, W, 7, 'F')
  doc.line(M, y, M, y + 7)
  doc.setLineWidth(0.2)
  doc.setTextColor(0, 0, 145)
  doc.setFontSize(9.5)
  doc.setFont(FONT_NAME, 'bold')
  doc.text('Préconisations générales — Gendarmerie Nationale', M + 4, y + 5)
  y += 13

  recommendations.forEach(sec => {
    ensureSpace(14)
    doc.setTextColor(0, 0, 145)
    doc.setFontSize(8.5)
    doc.setFont(FONT_NAME, 'bold')
    doc.text(sec.titre, M, y)
    y += 6
    sec.contenu.forEach(item => {
      ensureSpace(6)
      const plain = item.replace(/<[^>]+>/g, '')
      const lines = doc.splitTextToSize(`• ${plain}`, W - 4)
      doc.setTextColor(70, 70, 70)
      doc.setFontSize(8)
      doc.setFont(FONT_NAME, 'normal')
      lines.forEach(line => {
        ensureSpace(5)
        doc.text(line, M + 3, y)
        y += 4.5
      })
    })
    y += 5
  })

  // ── BRIGADE ALERT (only for "faible") ────────────────────────
  if (level === 'faible') {
    ensureSpace(28)
    doc.setFillColor(255, 244, 229)
    doc.setDrawColor(228, 106, 38)
    doc.setLineWidth(0.4)
    doc.rect(M, y, W, 26, 'FD')
    doc.setTextColor(107, 51, 0)
    doc.setFontSize(9.5)
    doc.setFont(FONT_NAME, 'bold')
    doc.text('Votre niveau de sécurité est insuffisant', M + 4, y + 7)
    doc.setFontSize(8)
    doc.setFont(FONT_NAME, 'normal')
    const alertLines = doc.splitTextToSize(
      `Rapprochez-vous de votre brigade de gendarmerie pour un accompagnement personnalisé. Trouvez votre brigade sur ${new URL(MASECURITE_HOME).host}`,
      W - 8
    )
    alertLines.forEach((l, i) => doc.text(l, M + 4, y + 14 + i * 5))
    y += 32
  }

  // ── SIGNATURE ────────────────────────────────────────────────
  if (sigB64) {
    const sigDims = await getImageDimensions(sigB64)
    const maxW = 65
    const ratio = sigDims.h / sigDims.w
    const sW = maxW
    const sH = Math.round(maxW * ratio)
    ensureSpace(sH + 8)
    doc.addImage(sigB64, 'PNG', (210 - sW) / 2, y, sW, sH)
    y += sH + 6
  }

  // ── FOOTER on every page ─────────────────────────────────────
  const total = doc.internal.getNumberOfPages()
  for (let i = 1; i <= total; i++) {
    doc.setPage(i)
    doc.setDrawColor(200, 200, 215)
    doc.setLineWidth(0.25)
    doc.line(M, PH - 11, 210 - M, PH - 11)
    doc.setTextColor(160, 160, 175)
    doc.setFontSize(6.5)
    doc.setFont(FONT_NAME, 'normal')
    doc.text(
      'Document confidentiel à usage personnel — Ne constitue pas un rapport officiel',
      105,
      PH - 8,
      { align: 'center' }
    )
    doc.text(
      `${new URL(MASECURITE_HOME).host}  ·  Urgences : 17  ·  Page ${i} / ${total}`,
      105,
      PH - 5,
      { align: 'center' }
    )
  }

  doc.save(`diagnostic-surete-${new Date().toISOString().split('T')[0]}.pdf`)
}
