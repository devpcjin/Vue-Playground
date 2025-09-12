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
      {
        path: 'svgo-for-moda',
        name: 'svgo-for-moda',
        component: () => import('@/view/svg/forModa/Index.vue'),
        meta: { nav: true, label: 'SVGO for MODA' },
      },
      {
        path: 'svgo-for-moda-flags',
        name: 'svgo-for-moda-flags',
        component: () => import('@/view/svg/forModa/flags/Index.vue'),
        meta: { nav: true, label: 'SVGO for MODA Flags' },
      },
    ],
  },
  {
    path: '/headless-ui',
    name: 'headless-ui',
    meta: { nav: true, label: 'Headless UI' },
    children: [
      {
        path: 'tabs',
        name: 'headless-ui-tabs',
        component: () => import('@/view/headless-ui/tabs/Index.vue'),
        meta: { nav: true, label: 'Tabs' },
      },
    ],
  },
  {
    path: '/editor',
    name: 'editor',
    meta: { nav: true, label: 'Editor' },
    children: [
      {
        path: 'tiptap',
        name: 'tiptap',
        component: () => import('@/view/editor/tiptap/Index.vue'),
        meta: { nav: true, label: 'Tiptap' },
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
