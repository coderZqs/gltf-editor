<template>
    <div class="right-wrapper">
        <a-collapse :bordered="false" v-model:activeKey="collapseKeys" expand-icon-position="end">
            <a-collapse-panel header="属性" key="1">
                <div>
                    <div class="flex my-2 items-center">
                        <span class="label">类型</span>
                        <span style="color: gray">{{ state.type }}</span>
                    </div>
                    <div class="flex my-2 items-center">
                        <span class="label">名称</span>
                        <span><a-input size="small" v-model:value="state.name"></a-input></span>
                    </div>
                    <div class="flex my-2 items-center">
                        <div class="flex-1 flex">
                            <span class="label">顶点数</span>
                            <span style="color: gray">{{ state.vertexCount }}</span>
                        </div>
                        <div class="flex-1 flex">
                            <span class="label">三角数</span>
                            <span style="color: gray">{{ state.triangleCount }}</span>
                        </div>
                    </div>
                </div>
            </a-collapse-panel>
            <a-collapse-panel header="变换" key="2">
                <div>
                    <div class="flex my-2 items-center">
                        <span class="label">位置</span>
                        <ProNumberInput size="small" class="mx-1" :min="-100" :max="100" v-model="state.position.x">
                        </ProNumberInput>
                        <ProNumberInput size="small" class="mx-1" :min="-100" :max="100" v-model="state.position.y">
                        </ProNumberInput>
                        <ProNumberInput size="small" class="mx-1" :min="-100" :max="100" v-model="state.position.z">
                        </ProNumberInput>
                    </div>
                    <div class="flex my-2 items-center">
                        <span class="label">旋转</span>
                        <ProNumberInput size="small" class="mx-1" :step="1" type="angle" :min="-360" :max="360"
                            v-model="state.rotation.x">
                        </ProNumberInput>
                        <ProNumberInput size="small" class="mx-1" :step="1" type="angle" :min="-360" :max="360"
                            v-model="state.rotation.y">
                        </ProNumberInput>
                        <ProNumberInput size="small" class="mx-1" :step="1" type="angle" :min="-360" :max="360"
                            v-model="state.rotation.z">
                        </ProNumberInput>
                    </div>
                    <div class="flex my-2 items-center">
                        <span class="label">缩放</span>
                        <ProNumberInput size="small" class="mx-1" :min="-100" :max="100" v-model="state.scale.x">
                        </ProNumberInput>
                        <ProNumberInput size="small" class="mx-1" :min="-100" :max="100" v-model="state.scale.y">
                        </ProNumberInput>
                        <ProNumberInput size="small" class="mx-1" :min="-100" :max="100" v-model="state.scale.z">
                        </ProNumberInput>
                    </div>
                </div>
            </a-collapse-panel>
            <a-collapse-panel header="材质" key="3" v-if="state.vertexCount">
                <div class="flex my-4 items-center">
                    <span class="label">颜色</span>
                    <color-picker v-model:hex="colorPickValue" @change="changeColor"></color-picker>
                </div>
                <div class="flex my-4 items-center">
                    <span class="label">粗糙度</span>
                    <ProNumberInput size="small" v-model="state.roughness"></ProNumberInput>
                </div>
                <div class="flex my-4 items-center">
                    <span class="label">金属度</span>
                    <ProNumberInput size="small" v-model="state.metalness"></ProNumberInput>
                </div>
                <div class="flex my-4 items-center">
                    <span class="label">贴图</span>
                    <TextureEditor type="map" v-model="state.map"></TextureEditor>
                </div>
                <!-- <div class="flex my-4 items-center">
                    <span class="label">顶点颜色</span>
                    <a-checkbox v-model:checked="state.vertexColors"></a-checkbox>
                </div> -->
                <div class="flex my-4 items-center">
                    <span class="label">自发光贴图</span>
                    <TextureEditor type="emissiveMap" v-model="state.emissiveMap"></TextureEditor>
                </div>
                <div class="flex my-4 items-center">
                    <span class="label">透明贴图</span>
                    <TextureEditor type="alphaMap" v-model="state.alphaMap"></TextureEditor>
                </div>
                <div class="flex my-4 items-center">
                    <span class="label">凹凸贴图</span>
                    <TextureEditor type="bumpMap" v-model="state.bumpMap"></TextureEditor>
                </div>
                <div class="flex my-4 items-center">
                    <span class="label">法线贴图</span>
                    <TextureEditor type="normalMap" v-model="state.normalMap"></TextureEditor>
                </div>
                <div class="flex my-84 items-center">
                    <span class="label">位移贴图</span>
                    <TextureEditor type="displacementMap" v-model="state.displacementMap"></TextureEditor>
                </div>
                <div class="flex my-4 items-center">
                    <span class="label">粗糙贴图</span>
                    <TextureEditor type="roughnessMap" v-model="state.roughnessMap"></TextureEditor>
                </div>
                <div class="flex my-4 items-center">
                    <span class="label">金属贴图</span>
                    <TextureEditor type="metalnessMap" v-model="state.metalnessMap"></TextureEditor>
                </div>
                <div class="flex my-4 items-center">
                    <span class="label">面</span>
                    <a-select size="small" v-model:value="state.side" :options="sideOptions" class="flex-1"></a-select>
                </div>
                <div class="flex my-4 items-center">
                    <span class="label">混合模式</span>
                    <a-select size="small" v-model:value="state.blending" :options="blending" class="flex-1"></a-select>
                </div>
                <div class="flex my-4 items-center">
                    <span class="label">透明度</span>
                    <ProNumberInput size="small" v-model="state.opacity"></ProNumberInput>
                </div>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, Ref } from "vue";
import IndexStore from "../../stores/index";
import SceneStore from "../../stores/three";
import * as THREE from "three";
import TextureEditor from "../TextureEditor/index.vue";
import ProNumberInput from "../ProNumberInput/index.vue";
import { Collapse as ACollapse, CollapsePanel as ACollapsePanel, Select as ASelect, Input as AInput, Checkbox as ACheckbox } from "ant-design-vue"
import { Config } from "@/types/index"

let Index = IndexStore();
let Scene = SceneStore();

// 配置
let state: Ref<Config> = ref({
    type: "",
    name: "",
    vertexCount: 0,
    color: new THREE.Color(),
    triangleCount: 0,
    position: new THREE.Vector3(0, 0, 0),
    scale: new THREE.Vector3(0, 0, 0),
    rotation: { x: 0, y: 0, z: 0 },
    side: "",
    blending: "",
    opacity: 1,
    roughness: 0.5,
    metalness: 0.5,
    map: "",
    emissiveMap: "",
    vertexColors: false,
    alphaMap: "",
    bumpMap: "",
    normalMap: "",
    displacementMap: "",
    roughnessMap: "",
    metalnessMap: "",

});

let collapseKeys = ref(["1", "2", "3"]);

let colorPickValue = ref("#000000");

watch(() => Index.current, () => { setStateByModel(Index.current) });

// 面枚举
const sideOptions = [
    { value: 0, label: "FrontSide" },
    { value: 1, label: "BackSide" },
    { value: 2, label: "DoubleSide" },
];

// 混合模式枚举
const blending = [
    { value: 0, label: "NoBlending" },
    { value: 1, label: "NormalBlending" },
    { value: 2, label: "AdditiveBlending" },
    { value: 3, label: "SubtractiveBlending" },
    { value: 4, label: "MultiplyBlending" },
    { value: 5, label: "CustomBlending" },
];

/**
 * 初始化值
 */

let materialKey = {
    color: "",
    opacity: "",
    roughness: "",
    metalness: "",
    vertexColors: "",
    map: "Map",
    alphaMap: "Map",
    bumpMap: "Map",
    normalMap: "Map",
    displacementMap: "Map",
    metalnessMap: "Map",
    side: "",
    blending: "",
};

/**
 * 通过模型取到状态
 * @param model 
 */

const setStateByModel = (model: THREE.Mesh) => {
    colorPickValue.value = "#" + (model.material?.color.getHexString() || '000000');
    state.value.type = model.isObject3D ? "Object" : "Group";
    state.value.name = model.name;
    state.value.vertexCount = model?.geometry?.attributes?.position?.count || 0;
    state.value.triangleCount = Math.floor(state.value.vertexCount / 3 || 0);
    state.value.position = model.position.clone();
    state.value.scale = model.scale.clone();

    // 旋转弧度转角度。
    let rotation = model.rotation.clone();
    state.value.rotation = { x: rotation.x * 180 / Math.PI, y: rotation.y * 180 / Math.PI, z: rotation.z * 180 / Math.PI };

    if (model.material) {
        Object.keys(materialKey).forEach(async (key) => {
            if (materialKey[key] == 'Map') {
                let mapImage = model.material[key]?.image;
                if (mapImage) {
                    state.value[key] = await transImage(mapImage);
                } else {
                    state.value[key] = "";
                }
            } else {
                state.value[key] = model.material[key];
            }
        })
    }
};

/**
 * 通过配置设置模型
 */

watch(() => state.value, (val) => { setModelByConfig(); }, { deep: true });

/**
 * 通过配置设置模型
 */

const setModelByConfig = () => {
    Scene.model.traverse((v) => {
        if (v.uuid === Index.current.uuid) {
            let { x, y, z } = state.value.position;
            let { x: sx, y: sy, z: sz } = state.value.scale;
            let { x: rx, y: ry, z: rz } = state.value.rotation;
            v.position.set(x, y, z);
            v.rotation.set(rx * Math.PI / 180, ry * Math.PI / 180, rz * Math.PI / 180);
            v.scale.set(sx, sy, sz);

            if (v.material) {
                Object.keys(materialKey).forEach((key) => {
                    if (materialKey[key] !== 'Map') {
                        v.material[key] = state.value[key];
                    }
                })
            }
        }
    });
};

/**
 * bmp转成image
 * @param bmp 
 */

let transImage = async (bmp) => {
    const canvas = document.createElement('canvas');
    canvas.width = bmp.width;
    canvas.height = bmp.height;
    const ctx = canvas.getContext('bitmaprenderer');
    let originalImageBitmap = await createImageBitmap(bmp);
    ctx!.transferFromImageBitmap(originalImageBitmap);
    const blob = await new Promise((res) => canvas.toBlob(res));

    canvas.remove();
    return URL.createObjectURL(blob);
}

/**
 * 修改颜色
 */

const changeColor = (e) => {
    state.value.color = new THREE.Color(e.hex);
}
</script>
<style lang="scss" scoped>
.m-colorPicker {
    display: none;
}

.right-wrapper {
    height: 100%;
    overflow-y: scroll;
    background: #141414;

    &::-webkit-scrollbar {
        width: 10px;
        height: 8px;
    }

    &::-webkit-scrollbar-track-piece {
        background-color: black;
        /*滚动条的背景颜色*/
        -webkit-border-radius: 0;
        /*滚动条的圆角宽度*/
    }

    &::-webkit-scrollbar-thumb:vertical {
        /*垂直滚动条的样式*/
        height: 50px;
        background-color: #141414;
        -webkit-border-radius: 4px;
        outline: 2px solid black;
        outline-offset: -2px;
        border: 2px solid black;
    }

    &::-webkit-scrollbar-thumb:hover {
        /*滚动条的hover样式*/
        height: 50px;
        background-color: #9f9f9f;
        -webkit-border-radius: 4px;
    }
}

.label {
    font-size: 14px;
    width: 90px;
}
</style>
