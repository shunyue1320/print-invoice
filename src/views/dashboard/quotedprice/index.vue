<script setup>
import { ref, onMounted } from 'vue';
import { read, utils, writeFileXLSX } from 'xlsx';

const heads = ref(['品名', '单位', '单价']);
const rows = ref([]);

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

// onMounted(async () => {
//   /* Download from https://sheetjs.com/pres.numbers */
//   const f = await fetch("https://sheetjs.com/pres.numbers");
//   const ab = await f.arrayBuffer();

//   /* parse workbook */
//   const wb = read(ab);

//   /* update data */
//   rows.value = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
// });

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
  <div>
    <input type="file" @change="exportXLSX" />
    <button @click="exportFile">下载</button>
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
  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped>
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
