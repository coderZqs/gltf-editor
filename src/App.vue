<template>
  <a-config-provider :theme="{
    algorithm: theme.darkAlgorithm,
  }">
    <router-view></router-view>
  </a-config-provider>
</template>
<script setup lang="ts">
import { theme, ConfigProvider as AConfigProvider } from "ant-design-vue";
</script>

<style lang="scss"></style>
