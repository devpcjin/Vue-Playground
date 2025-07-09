import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/view/Main.vue'),
    meta: { nav: true, label: 'Home' },
  },
  {
    path: '/validation',
    name: 'validation',
    meta: { nav: true, label: 'Validation' },
    children: [
      {
        path: 'zod-vs-yup',
        name: 'zod-vs-yup',
        component: () => import('@/view/validation/zod-vs-yup/Index.vue'),
        meta: { nav: true, label: 'Zod vs Yup Form' },
      },
      {
        path: 'zod-vs-yup/playground',
        name: 'zod-vs-yup-playground',
        component: () => import('@/view/validation/zod-vs-yup/playground/Index.vue'),
        meta: { nav: true, label: 'Zod vs Yup Playground' },
      },
    ],
  },
  {
    path: '/svg',
    name: 'svg',
    meta: { nav: true, label: 'SVG' },
    children: [
      {
        path: 'svgo-optimizer',
        name: 'svgo-optimizer',
        component: () => import('@/view/svg/svgo/Index.vue'),
        meta: { nav: true, label: 'SVGO Optimizer' },
      },
    ],
  },

  // 필요시 다른 라우트 추가
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
