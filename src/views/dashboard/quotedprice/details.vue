<template>
  <div class="quotedprice-details-form">
    <el-form label-width="120px">
      <el-form-item label="报价单标题">
        <el-input v-model="quotedpriceTitle" placeholder="请填写报价单标题" />
      </el-form-item>
      <el-form-item label="报价单表格">
        <el-upload
          v-model:file-list="fileList"
          :auto-upload="false"
          accept=".xlsx, .xls"
          :limit="1"
        >
          <el-button type="primary">上传 excal 表格</el-button>
          <template #tip>
            <div class="el-upload__tip">xlsx/xls 文件大小小于500KB.</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button type="danger" @click="onDelete">删除</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div>
    <table>
      <thead>
        <th v-for="name in heads" :key="name">{{ name }}</th>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row._id">
          <td v-for="name in heads" :key="name">{{ row[name] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { read, utils } from 'xlsx';

const time = ref();
const quotedpriceTitle = ref('');
const heads = ref(['默认品名', '单位', '单价']);
const rows = ref([
  { 默认品名: '丝瓜', 单位: '斤', 单价: 8 },
  { 默认品名: '芥兰苗', 单位: '斤', 单价: 6 },
  { 默认品名: '宁夏芥兰', 单位: '斤', 单价: 7 },
  { 默认品名: '本地芥兰', 单位: '斤', 单价: 5 },
  { 默认品名: '广东芥兰', 单位: '斤', 单价: 5 },
  { 默认品名: '水东芥菜', 单位: '斤', 单价: 6 },
  { 默认品名: '本地菜心', 单位: '斤', 单价: 5 },
  { 默认品名: '苋菜', 单位: '斤', 单价: 6.5 },
  { 默认品名: '紫椰菜', 单位: '斤', 单价: 4 },
]);

function getQuotedpricelist() {
  let quotedpricelist = localStorage.getItem('quotedpricelist');
  if (!quotedpricelist) {
    quotedpricelist = [];
  } else {
    quotedpricelist = JSON.parse(quotedpricelist);
  }

  return quotedpricelist;
}

function setInvoiceHeads() {
  heads.value = Object.keys(rows.value[0]).filter(i => i !== '_id');
}

const route = useRoute();
onMounted(async () => {
  if (route.query.time) {
    time.value = route.query.time;

    let quotedpricelist = getQuotedpricelist();

    const quotedpriceRes = quotedpricelist.find(i => i.time == time.value);
    if (quotedpriceRes) {
      rows.value = quotedpriceRes.rows;
      setInvoiceHeads();
      // heads.value = Object.keys(quotedpriceRes.rows[0]);
      quotedpriceTitle.value = quotedpriceRes.title;
    }
  }
});

const fileList = ref([]);
watchEffect(async () => {
  if (fileList.value[0]) {
    const data = await fileList.value[0].raw.arrayBuffer();
    const wb = read(data);
    const ws = wb.Sheets[wb.SheetNames[0]];
    rows.value = utils.sheet_to_json(ws);
    heads.value = Object.keys(rows.value[0]);
  }
});

const router = useRouter();
function onSubmit() {
  if (!quotedpriceTitle.value) {
    ElMessage({
      message: '请填写报价单标题',
      type: 'warning',
    });
    return;
  }

  let quotedpricelist = getQuotedpricelist();
  const quotedprice = quotedpricelist.find(item => item.time == time.value);
  if (quotedprice) {
    quotedprice.title = quotedpriceTitle.value;
    quotedprice.rows = rows.value;
  } else {
    const _rows = rows.value.map((row, index) => ({ ...row, _id: index }));
    quotedpricelist.unshift({
      time: new Date().getTime(),
      title: quotedpriceTitle.value,
      rows: _rows,
    });
  }

  localStorage.setItem('quotedpricelist', JSON.stringify(quotedpricelist));
  router.push({ path: '/dashboard/quotedprice' });
}

function onDelete() {
  if (!time.value) {
    ElMessage({
      message: '还没有创建报价单',
      type: 'warning',
    });
    return;
  }

  let quotedpricelist = getQuotedpricelist();
  const index = quotedpricelist.findIndex(item => item.time == time.value);
  if (index === -1) {
    ElMessage({
      message: '没有该报价单',
      type: 'warning',
    });
    return;
  }

  quotedpricelist.splice(index, 1);
  localStorage.setItem('quotedpricelist', JSON.stringify(quotedpricelist));
  router.push({ path: '/dashboard/quotedprice' });
}
</script>

<style scoped>
.quotedprice-details-form {
  display: flex;
  align-items: center;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
