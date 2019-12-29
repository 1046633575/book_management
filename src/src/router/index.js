import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const Index = () => import('../views/index.vue')
const Type = () => import('../views/type.vue')

const routes = [
  { 
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/type',
    name: 'type',
    component: Type
  }
]

const router = new VueRouter({
  routes
})

export default router
