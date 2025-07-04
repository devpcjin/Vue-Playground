import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/validation/zod-vs-yup',
    component: () => import('@/view/validation/zod-vs-yup/Index.vue'),
  },
  // 필요시 다른 라우트 추가
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
