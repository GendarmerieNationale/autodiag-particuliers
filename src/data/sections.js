export const sectionIconMap = {
  Extérieurs: 'ri-landscape-line',
  'Façades & Intérieur': 'ri-door-open-line',
  'Votre Quotidien': 'ri-calendar-check-line',
  Immeuble: 'ri-building-2-line',
  "Accès à l'immeuble": 'ri-key-line',
  'Votre Logement': 'ri-home-heart-line',
}

export function answerLabel(value) {
  if (value === 'oui') return 'Oui'
  if (value === 'non') return 'Non'
  if (value === 'sais_pas') return 'Je ne sais pas'
  return '—'
}
