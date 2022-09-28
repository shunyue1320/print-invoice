<template>
  <el-button type="primary" style="margin: 10px" @click="toLink('/dashboard/quotedpricedetails')">
    添加报价单
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
          <div class="card-type-list">
            <div v-for="o in Object.keys(item.rows[0]).filter(i => i !== '_id')" :key="o">
              {{ o }}
            </div>
          </div>
          <div>创建日期：{{ dayjs(item.time).format('YYYY-MM-DD HH:mm') }}</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';

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

const router = useRouter();
const toLink = path => {
  router.push({ path: path });
};
</script>

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

.card-type-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box-card {
  width: 300px;
}
.f-f {
  color: #fff;
}
</style>
