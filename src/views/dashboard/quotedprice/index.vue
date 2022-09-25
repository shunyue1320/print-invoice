<script setup>
import { ref, onMounted } from 'vue';
</script>

<template>
  <div class="quotedprice-container">
    <el-button type="primary" style="margin: 10px">
      <router-link to="/dashboard/quotedpricedetails"> 添加报价单 </router-link>
    </el-button>

    <div class="quotedprice-item-container">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>xxx店报价单</span>
            <el-button>编辑</el-button>
          </div>
        </template>
        <div class="card-content">
          <div v-for="o in ['品名', '单位', '单价']" :key="o" class="text item">{{ o }}</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.quotedprice-container {
  display: flex;
}
.quotedprice-item-container {
  margin: 10px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 300px;
}
</style>
