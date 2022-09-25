<script setup>
import { Document, Menu as IconMenu } from '@element-plus/icons-vue';
</script>

<template>
  <div class="layout-container">
    <div class="layout-left-container">
      <el-menu default-active="1">
        <el-menu-item index="2">
          <el-icon><icon-menu /></el-icon>
          <router-link to="/dashboard/invoice">发货单</router-link>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon><document /></el-icon>
          <router-link to="/dashboard/quotedprice">报价单</router-link>
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

<style>
.layout-container {
  display: flex;
  width: 100vw;
  height: 100vh;
}
.layout-right-container {
  flex: 1;
}
</style>
