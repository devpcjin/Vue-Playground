import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/view/Main.vue'),
  },
  {
    path: '/validation',
    children: [
      {
        path: 'zod-vs-yup',
        component: () => import('@/view/validation/zod-vs-yup/Index.vue'),
      },
      {
        path: 'zod-vs-yup/playground',
        component: () => import('@/view/validation/zod-vs-yup/playground/Index.vue'),
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
