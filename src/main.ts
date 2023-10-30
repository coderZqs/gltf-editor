import "tailwindcss/tailwind.css";
import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "@/router/index";
import "./assets/styles/index.css";

import ColorPicker from "colorpicker-v3"; // 注册组件
import "./assets/styles/pickColor.css"; // 引入样式文件

const app = createApp(App);
app.use(ColorPicker).use(createPinia()).use(router).mount("#app");

