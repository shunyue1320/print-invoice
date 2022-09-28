<template>
  <div class="layout-container">
    <div class="layout-left-container">
      <el-menu default-active="1" class="layout-menu">
        <el-menu-item index="2" @click="toLink('/dashboard/invoice')">
          <el-icon><icon-menu /></el-icon>
          发货单
        </el-menu-item>
        <el-menu-item index="3" @click="toLink('/dashboard/quotedprice')">
          <el-icon><document /></el-icon>
          报价单
        </el-menu-item>
      </el-menu>
    </div>
    <div class="layout-right-container">
      <ElScrollbar>
        <router-view>
          <template #default="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </template>
        </router-view>
      </ElScrollbar>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { Document, Menu as IconMenu } from '@element-plus/icons-vue';

const router = useRouter();
const toLink = path => {
  router.push({ path: path });
};
</script>

<style>
.layout-container {
  display: flex;
  width: 100vw;
  height: 100vh;
}
.layout-left-container {
  height: 100vh;
}
.layout-menu {
  height: 100%;
}
.layout-right-container {
  flex: 1;
  padding: 10px;
}
.f-w {
  color: inherit;
}
</style>
