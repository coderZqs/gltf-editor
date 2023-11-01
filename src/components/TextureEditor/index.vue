<template>
    <div class="flex items-center">
        <a-checkbox class="mr-2" v-model:checked="isUse" :disabled="!modelValue" @change="changeUse"></a-checkbox>
        <div class="upload-wrapper"
            :style="{ background: modelValue ? `url(${modelValue})` : 'white', backgroundSize: 'cover' }">
            <input type="file" @change="uploadFile">
        </div>
        <DownloadOutlined class="ml-2" v-if="modelValue" @click="download" />
    </div>
</template>

<script setup lang="ts">
import { Checkbox as ACheckbox } from "ant-design-vue"
import { DownloadOutlined } from "@ant-design/icons-vue"
import { ref, computed, watch, onMounted } from "vue"
import * as THREE from "three"
import IndexStore from "@/stores/index"
import SceneStore from "@/stores/three"
import _Draggable from "gsap/Draggable"
let Index = IndexStore();
let Scene = SceneStore();

let props = defineProps({
    modelValue: { type: String, default: "" },
    type: { type: String, default: "" }
})

let emits = defineEmits(['update:modelValue'])

let textureUrl = computed({
    set: (val) => {
        emits("update:modelValue", val);
    },

    get: () => {
        return props.modelValue;
    }
})

const download = () => {
    downloadFile(textureUrl.value);
}

const downloadFile = (url: string, filename = 'texture'): void => {
    const link = document.createElement('a')
    link.href = url;
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

let isUse = ref(true);

const uploadFile = (e) => {
    let image = URL.createObjectURL(e.target.files[0])
    textureUrl.value = image;

    let texture = new THREE.TextureLoader();
    texture.load(image, (t) => {
        Scene.model.traverse((v) => {
            if (v.uuid === Index.current.uuid) {
                v.material[props.type] = t;
                v.material.needsUpdate = true;
                isUse.value = true;
            }
        });
    })

    e.target.value = ""
}


/**
 * 禁用启用
 */

const changeUse = (e) => {
    let isChecked = e.target.checked;
    if (!isChecked) {
        Scene.model.traverse((v) => {
            if (v.uuid === Index.current.uuid) {
                v.material[props.type] = "";
                v.material.needsUpdate = true;
                textureUrl.value = ""
            }
        });
    }
}

</script>

<style lang="scss" scoped>
.upload-wrapper {
    height: 20px;
    width: 40px;
    background: white;
    cursor: pointer;
    position: relative;

    input {
        position: absolute;
        top: 0;
        left: 0;
        cursor: pointer;
        opacity: 0;
        display: block;
        width: 100%;
        height: 100%;
    }
}
</style>