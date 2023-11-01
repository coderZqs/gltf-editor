<template>
  <div class="scene flex-1" ref="canvasWrapper" v-show="state.gltfUploaded"></div>
  <div class="upload-wrapper flex justify-center items-center" v-show="!state.gltfUploaded">
    <a-spin :spinning="state.isLoading">
      <a-upload-dragger :beforeUpload="beforeUpload" name="file" :multiple="true"
        action="http://www.hiwindy.cn/life_photo/common/upload" @drop="handleDrop" @change="handleChange"
        style="width: 600px">
        <p class="ant-upload-drag-icon">
          <inbox-outlined></inbox-outlined>
        </p>
        <p class="ant-upload-text">点击或者拖拽进行上传</p>
        <p class="ant-upload-hint">请上传 GLTF 或 GLB 文件</p>
      </a-upload-dragger>
    </a-spin>
  </div>
</template>
<script lang="ts" setup>
import { UploadDragger as AUploadDragger, Spin as ASpin, message } from 'ant-design-vue';
import { ref, reactive, nextTick, defineEmits } from "vue";
import threeStore from "../../stores/three";
import IndexStore from "../../stores/index";
import T from "@/utils/threeUtils";
import { InboxOutlined } from "@ant-design/icons-vue";

let Scene = threeStore();
let Index = IndexStore();
const state = reactive({ isLoading: false, gltfUploaded: false });
let canvasWrapper = ref(null);
let emits = defineEmits(["uploadSuccess"]);

/**
 * 上传成功
 */

const handleChange = async (info) => {
  const status = info.file.status;
  if (status === "uploading") {
    state.isLoading = true;
  }

  if (!status) {
    return message.error('请上传gltf与glb文件')
  }

  if (status === "done") {
    let code = info.file.response.code;
    if (code === 200) {
      let fileUrl = "http://www.hiwindy.cn/life_photo/" + info.file.response.data.image;
      let e = (await T.loadGLTF(fileUrl)) as any;

      console.log(e)
      state.isLoading = false;
      state.gltfUploaded = true;
      // 发送给父元素，用于控制左右两边菜单栏显隐。
      emits("uploadSuccess", state.gltfUploaded);

      let model = e.scene.children[0];
      Scene.model = model;
      Index.current = model;
      model.position.set(0, 0, 0);
      Scene.scene!.add(model);

      model.traverse((v) => {
        if (v.isMesh) {
          v.material.transparent = true;
          v.material.opacity = 1;
        }
      })

      Index.tree = { uuid: model.uuid, key: model.uuid, title: model.name, children: [] };
      Index.getTree(model, Index.tree!.children);
      nextTick(() => {
        Scene.initScreen(canvasWrapper.value);
      });
    }
  }
};

const beforeUpload = file => {
  return new Promise((resolve, reject) => {
    if (['gltf', 'glb'].includes(file.name.split('.')[1])) {
      resolve()
    } else {
      reject('error')
    }

  });
};

/**
 * 拖拽上传
 */

const handleDrop = (e: DragEvent) => { };
</script>
<style scoped>
.scene {
  height: 100vh;
  overflow: hidden;
}

.upload-wrapper {
  background: black;
  height: 100vh;
  flex: 1;
}

::v-deep .ant-upload-list {
  display: none;
}
</style>
