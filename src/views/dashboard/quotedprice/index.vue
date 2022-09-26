<script setup>
import { ref, onMounted } from 'vue';

function getQuotedpricelist() {
  let quotedpricelist = localStorage.getItem('quotedpricelist');
  if (!quotedpricelist) {
    quotedpricelist = [];
  } else {
    quotedpricelist = JSON.parse(quotedpricelist);
  }

  return quotedpricelist;
}

const quotedpricelist = ref([]);
onMounted(() => {
  quotedpricelist.value = getQuotedpricelist();
});
</script>

<template>
  <el-button type="primary" style="margin: 10px">
    <router-link to="/dashboard/quotedpricedetails"> 添加报价单 </router-link>
  </el-button>
  <div class="quotedprice-container">
    <div v-for="item in quotedpricelist" :key="item.time" class="quotedprice-item-container">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>{{ item.title }}</span>
            <router-link
              :to="{ path: '/dashboard/quotedpricedetails', query: { time: item.time } }"
            >
              <el-button>编辑</el-button>
            </router-link>
          </div>
        </template>
        <div class="card-content">
          <div v-for="o in Object.keys(item.rows[0])" :key="o" class="text item">{{ o }}</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.quotedprice-container {
  display: flex;
  flex-wrap: wrap;
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
