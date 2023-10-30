<template>
    <div class="left-wrapper">
        <a-tree :tree-data="[Index.tree]" @select="onNodeClick" class="mt-2" v-model:expandedKeys="expandedKeys">
            <template #title="{ title, key }">
                <div style="width:100%;line-height:30px;">{{ title }}</div>
            </template>
        </a-tree>
    </div>
</template>

<script setup lang="ts">
import indexStore from "../../stores/index"
import SceneStore from "../../stores/three"
import { ref, defineExpose } from "vue"
import { Tree as ATree } from "ant-design-vue"

let Index = indexStore();
let Scene = SceneStore();

/**
 * 侧边栏点击事件
 */

const expandedKeys = ref([]);
const searchValue = ref("");

const onNodeClick = (selectKey, { node }) => {
    let uuid = node.dataRef.uuid;
    Scene.model.traverse((v) => {
        if (v.uuid === uuid) {
            Index.current = v;
            console.log(Index.current)
            Scene.outlinePass.selectedObjects = [v];
        }
    })
}

const extendsAll = () => {
    expandedKeys.value = [Scene.model.uuid];
}

defineExpose({ extendsAll })
</script>

<style scoped>
.left-wrapper {
    height: 100%;
    background: #141414;
    overflow: hidden;
}

::v-deep .ant-tree-treenode {
    width: 100%;
}

::v-deep .ant-tree-node-content-wrapper {
    flex: 1;
    margin-right: 12px;
}
</style>