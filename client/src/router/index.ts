import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import LampPage from "../views/LampPage.vue";
import HowToPage from "../views/HowToPage.vue";
import PlayPage from "../views/PlayPage.vue";
import SettingsPage from "../views/SettingsPage.vue";
import SpectatePage from "../views/SpectatePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/lamp",
      name: "lamp",
      component: LampPage,
    },
    {
      path: "/play",
      name: "play",
      component: PlayPage,
    },
    {
      path: "/how-to",
      name: "how-to",
      component: HowToPage,
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsPage,
    },
    {
      path: "/spectate",
      name: "spectate",
      component: SpectatePage,
    },
  ],
});

export default router;
