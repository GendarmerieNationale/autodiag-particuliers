import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TypeView from '../views/TypeView.vue'
import QuestionnaireView from '../views/QuestionnaireView.vue'
import RecapView from '../views/RecapView.vue'
import ResultView from '../views/ResultView.vue'
import RecommendationsView from '../views/RecommendationsView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/type', name: 'type', component: TypeView },
    { path: '/questionnaire', name: 'questionnaire', component: QuestionnaireView },
    { path: '/recapitulatif', name: 'recapitulatif', component: RecapView },
    { path: '/resultat', name: 'resultat', component: ResultView },
    { path: '/preconisations', name: 'preconisations', component: RecommendationsView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
