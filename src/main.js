import { createApp } from "vue";
import './style.css'
import App from "./App.vue";

import { OhVueIcon, addIcons } from "oh-vue-icons";
import { RiSendPlaneFill, FaUser } from "oh-vue-icons/icons";
addIcons(RiSendPlaneFill, FaUser);

const app = createApp(App);
app.component("v-icon", OhVueIcon);
app.mount("#app");
