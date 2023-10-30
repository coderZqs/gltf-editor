import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { visualizer } from "rollup-plugin-visualizer";
import { autoComplete, Plugin as importToCDN } from "vite-plugin-cdn-import";
import vueJsx from "@vitejs/plugin-vue-jsx";
import compressPlugin from "vite-plugin-compression";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";

let cdn = () =>
  importToCDN({
    modules: [
      {
        name: "three",
        var: "THREE",
        path: `https://cdn.bootcdn.net/ajax/libs/three.js/0.148.0/three.js`
      },
    ]
  });

export default defineConfig({
  base: process.env.NODE_ENV === "development" ? "" : "./",
  plugins: [
    vue(),
    vueJsx(),
    visualizer(),
    cdn(),
    compressPlugin({
      threshold: 100000 // 对大于 1mb 的文件进行压缩
    }),
    AutoImport({
      imports: ["vue", "vue-router"],
      eslintrc: {
        enabled: false,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true
      }
    })
  ],
  build: {
    target: ["edge90", "chrome90", "firefox90", "safari15"]
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  server: {
    port: 8888,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://www.hiwindy.cn",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, "")
      }
    }
  },

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          "primary-color": "#000000",
          "link-color": "#000000"
        }
      }
    }
  }
});
