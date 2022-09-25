<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { read, utils, writeFileXLSX } from 'xlsx';

const time = ref();
const quotedpriceTitle = ref('');
const heads = ref(['品名', '单位', '单价']);
const rows = ref([
  {
    品名: '丝瓜',
    单位: '斤',
    单价: 8,
  },
  {
    品名: '芥兰苗',
    单位: '斤',
    单价: 6,
  },
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

const route = useRoute();
onMounted(async () => {
  if (route.params.time) {
    time.value = route.params.time;

    let quotedpricelist = getQuotedpricelist();

    const quotedpriceRes = quotedpricelist.find(i => i.time === time.value);
    if (quotedpriceRes) {
      rows.value = quotedpriceRes.rows;
      heads.value = Object.keys(quotedpriceRes.rows[0]);
      quotedpriceTitle.value = quotedpriceRes.title;
    }
  }
});

const exportXLSX = async e => {
  const file = e.target.files[0];
  const data = await file.arrayBuffer();
  const wb = read(data);
  const ws = wb.Sheets[wb.SheetNames[0]];
  console.log('utils.sheet_to_json(ws) ===', utils, utils.sheet_to_json(ws));
  rows.value = utils.sheet_to_json(ws);
  heads.value = Object.keys(rows.value[0]);
  // setHTML(XLSX.utils.sheet_to_html(ws, { id: "tabeller" }));
};

function save() {
  if (!quotedpriceTitle.value) {
    ElMessage({
      message: '请填写报价单标题',
      type: 'warning',
    });
    return;
  }

  let quotedpricelist = getQuotedpricelist();

  quotedpricelist.push({
    time: new Date().getTime(),
    title: quotedpriceTitle.value,
    rows: rows.value,
  });
  localStorage.setItem('quotedpricelist', JSON.stringify(quotedpricelist));
}

/* get state data and export to XLSX */
function exportFile() {
  exportHead = [];
  const ws = utils.json_to_sheet(rows.value);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Data');
  writeFileXLSX(wb, '发货单.xlsx');
}
</script>

<template>
  <div class="quotedprice-details-form">
    <el-input
      v-model="quotedpriceTitle"
      placeholder="请填写报价单标题"
      style="width: 200px; margin-right: 10px"
    />
    <input type="file" @change="exportXLSX" />
    <el-button type="primary" @click="save">确定</el-button>
  </div>
  <div>
    <table>
      <thead>
        <th v-for="name in heads" :key="name">{{ name }}</th>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in rows" :key="idx">
          <td v-for="name in heads" :key="name">{{ row[name] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

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
