import { createApp } from 'vue'
import VueDsfr from '@gouvminint/vue-dsfr'
import '@gouvfr/dsfr/dist/dsfr.min.css'
import '@gouvminint/vue-dsfr/styles'
import 'remixicon/fonts/remixicon.css'
import '@/assets/tokens.css'

import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)

// vue-dsfr's install() registers VIcon twice (loop + explicit call) — silence that one warn
const originalWarn = app.config.warnHandler
app.config.warnHandler = (msg, instance, trace) => {
  if (msg.includes('Component "VIcon" has already been registered')) return
  if (originalWarn) originalWarn(msg, instance, trace)
  else console.warn(`[Vue warn]: ${msg}${trace}`)
}

app.use(VueDsfr)
app.use(router)
app.mount('#app')
