<template>
  <div class="wrapper">
    <div class="header flex justify-between items-center">
      <div class="title">GLTF 编辑器</div>
      <div class="icon">
        <a-button class="mr-2" @click="exportGltf" type="primary" v-if="gltfUploaded">导出模型</a-button>
      </div>
    </div>
    <div class="flex">
      <div class="left shrink-0">
        <Left ref="left" :style="{ transform: `translateX(${gltfUploaded ? 0 : -360}px)` }" style="transition: all 0.2s">
        </Left>
      </div>
      <Center @uploadSuccess="uploadSuccess"></Center>
      <div class="right shrink-0">
        <Right :style="{ transform: `translateX(${gltfUploaded ? 0 : 360}px)` }" style="transition: all 0.2s"></Right>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button as AButton } from "ant-design-vue"
import threeStore from "../stores/three"
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
let Three = threeStore();

import { ref, watch, onMounted, nextTick } from "vue"
import * as THREE from "three";
import Left from "@/components/left/index.vue"
import Right from "@/components/right/index.vue"
import Center from "@/components/center/index.vue"
import { saveAs } from "file-saver";
Three.scene.add(Three.camera);
Three.renderer.shadowMap.enabled = true;
let gltfUploaded = ref(false);
let left = ref();
let isExportLoading = ref(false);

let light = new THREE.AmbientLight(0xffffff, 1);
Three.scene.add(light);

let directLight = new THREE.DirectionalLight(0xFF0000, 1);
Three.scene.add(directLight);
directLight.position.set(5, 5, -5);
Three.camera.position.set(10, 10, 10);

const gridHelper = new THREE.GridHelper(50, 50, 0x888888, 0x888888);
Three.scene.add(gridHelper);

const uploadSuccess = (val) => {
  gltfUploaded.value = val;
  nextTick(() => {
    left.value.extendsAll();
  })
}

function exportGltf() {
  isExportLoading.value = true;
  const exporter = new GLTFExporter();
  exporter.parse(Three.model, function (gltfJson) {
    const jsonString = JSON.stringify(gltfJson);
    const blob = new Blob([jsonString], { type: "application/json" });
    saveAs(blob, "colored-square.glb");
    isExportLoading.value = false;
  }, { binary: true });
}
</script>

<style lang="scss" scoped>
$headerHeight: 48px;

.left,
.right {
  background: black;
  width: 320px;
  height: calc(100vh - $headerHeight);
  overflow-y: hidden;
  overflow-x: hidden;
}

.wrapper {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.header {
  height: $headerHeight;
  background: #141414;

  .title {
    color: white;
    font-weight: 600;
    font-size: 16px;
    margin-left: 12px;
    letter-spacing: 1px;
  }
}
</style>
