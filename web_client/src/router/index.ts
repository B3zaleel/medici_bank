import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: 'Home',
      requiresAuth: false,
    },
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/sign-in',
    name: 'sign_in',
    meta: {
      title: 'Sign In',
      requiresAuth: false,
      disableOnSignedIn: true,
    },
    component: () => import('../views/auth/SignIn.vue'),
  },
  {
    path: '/sign-up',
    name: 'sign_up',
    meta: {
      title: 'Sign Up',
      requiresAuth: false,
      disableOnSignedIn: true,
    },
    component: () => import('../views/auth/SignUp.vue'),
  },
  {
    path: '/delete-account',
    name: 'delete_account',
    meta: {
      title: 'Delete Account',
      requiresAuth: true,
    },
    component: () => import('../views/auth/DeleteAccount.vue'),
  },
  {
    path: '/services',
    name: 'services',
    meta: {
      title: 'Services',
      requiresAuth: true,
    },
    component: () => import('../views/Services.vue'),
  },
  {
    path: '/transactions',
    name: 'transactions',
    meta: {
      title: 'Transactions',
      requiresAuth: true,
    },
    component: () => import('../views/Transactions.vue'),
  },
  {
    path: '/about',
    name: 'about',
    meta: {
      title: 'About',
      requiresAuth: false,
    },
    component: () => import('../views/About.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'error_404',
    meta: {
      title: 'Error 404',
      requiresAuth: false,
    },
    component: () => import('../views/Error.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, _, next) => {
  const isAuthenticated =
    window.localStorage.getItem('user.isAuthenticated') === 'true';
  if (!isAuthenticated && to.meta?.requiresAuth) {
    next('/sign-in');
  } else if (isAuthenticated && to.meta?.disableOnSignedIn) {
    next('/');
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title = to.meta?.title ? `${to.meta.title} - Medici` : 'Medici';
});

export default router;
