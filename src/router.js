import { createRouter, createWebHistory } from "vue-router"

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/update-request',
    name: 'update-request',
    component: () => import('./views/UpdateKeywordsRequest.vue')
  },
  {
    path: '/update-keywords',
    name: 'update-keywords',
    component: () => import('./views/UpdateKeywords.vue')
  },
  {
    path: '/unsubscribe/:email',
    name: 'unsubscribe',
    component: () => import('./views/Unsubscribe.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'error',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('./views/NotFound.vue')
  }
]

export default createRouter({
  history: createWebHistory(),
  routes: routes
})