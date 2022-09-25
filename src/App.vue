<script lang="ts" setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
</script>

<template>
  <ElConfigProvider :locale="zhCn" :message="{ max: 1 }">
    <RouterView />
  </ElConfigProvider>
</template>
