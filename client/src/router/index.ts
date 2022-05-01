import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/lamp",
      name: "lamp",
      component: () => import("../views/Lamp.vue"),
    },
    {
      path: "/howto",
      name: "howto",
      component: () => import("../views/HowTo.vue"),
    },
  ],
});

export default router;
