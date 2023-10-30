<template>
    <div class="pro-number-input">
        <input type="number" v-model="value" @mousedown="mousedown" @blur="blur">
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
let props = defineProps({ modelValue: { type: Number, default: 0 }, step: { type: Number }, min: { type: Number, default: 0 }, max: { type: Number, default: 1 } });
let emits = defineEmits(["update:modelValue"])

let value = computed({
    set: (val) => {
        emits("update:modelValue", Number(val));
    },

    get: () => {
        return props.modelValue.toFixed(1);
    }
})

/**
 * 通过max min值进行value修改
 */
const formatValueByLimit = (value) => {
    if (value < props.min) {
        value = props.min
    }

    if (value > props.max) {
        value = props.max;
    }

    emits("update:modelValue", value);
}

const mousedown = (e) => {
    let sourceValue = JSON.parse(JSON.stringify(props.modelValue));
    let sourcePoiY = e.pageY;
    window.onmousemove = (moveEvent) => {
        let rY = sourcePoiY - moveEvent.pageY;
        let value = Number((sourceValue + rY * (props.step || 0.1)).toFixed(2));
        formatValueByLimit(value);
    }

    window.onmouseup = () => {
        window.onmousemove = null;
    }
}

const blur = () => {
    formatValueByLimit(props.modelValue);
}
</script>

<style lang="scss" scoped>
.pro-number-input {
    input {
        width: 60px;
        outline: none;
        border: none;
        background: transparent;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none !important;
            margin: 0;
        }
    }
}
</style>