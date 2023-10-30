import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";

const ConstantRouterMap = [
  {
    path: "/",
    component: () => import("@/views/index.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...ConstantRouterMap],
});

export default router;
