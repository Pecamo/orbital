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
      path: "/play",
      name: "play",
      component: () => import("../views/Play.vue"),
    },
    {
      path: "/howto",
      name: "howto",
      component: () => import("../views/HowTo.vue"),
    },
    {
      path: "/spectate",
      name: "spectate",
      component: () => import("../views/Spectate.vue"),
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("../views/Settings.vue"),
    },
  ],
});

export default router;
