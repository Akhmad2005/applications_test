import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/index.vue'),
      meta: {
        requiresAuth: true,
        title: 'Список заявок'
      }
    },
    {
      path: '/login',
      name: 'Login',
      meta: {
        title: 'Вход в аккаунт'
      },
      component: () => import('../views/login/index.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  document.title = to?.meta?.title || 'Applications';
});

export default router