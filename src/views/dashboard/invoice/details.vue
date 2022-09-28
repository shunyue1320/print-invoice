<template>
  <div>
    <el-row class="invoice-row-container">
      <el-col :span="12" style="border-right: 1px solid #eceef4">
        <h3 style="text-align: center">{{ quotedprice.title }}</h3>
        <div class="invoice-filter-container">
          <el-input v-model="keyWord" class="mx-10" placeholder="输入关键字如：丝瓜 芥兰苗" />
          <el-button type="primary" @click="find">查询</el-button>
          <el-button class="mr-10" @click="reset">重置</el-button>
        </div>
        <el-table
          ref="invoiceTableRef"
          :data="invoice.rows"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :stripe="true"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            v-for="(name, index) in invoiceHeads"
            :key="index"
            :label="name"
            :property="name"
            width="100"
          />
        </el-table>
      </el-col>
      <el-col :span="12">
        <h3 style="text-align: center">{{ invoice.title }}</h3>
        <el-button class="m-10" type="primary" @click="exportFile">导出 excal 表格</el-button>
        <el-table
          ref="checkedInvoiceTableRef"
          :data="checkedInvoiceRows"
          style="width: 100%"
          :stripe="true"
        >
          <el-table-column
            v-for="(name, index) in invoiceHeads"
            :key="index"
            :label="name"
            :property="name"
            width="100"
          />
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, unref, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { utils, writeFileXLSX } from 'xlsx';

const route = useRoute();
const router = useRouter();

const invoiceTableRef = ref();
const keyWord = ref('');

const invoice = ref({
  title: null,
  time: null,
  rows: null,
});
const invoiceHeads = ref([]);
const checkedInvoiceRows = ref([]);
const quotedprice = ref({});

function cacheInvoiceList() {
  const invoiceList = getInvoiceList();
  const cacheInvoice = invoiceList.find(i => i.time == invoice.value.time);
  cacheInvoice.rows = invoice.value.rows;

  localStorage.setItem('invoiceList', JSON.stringify(unref(invoiceList)));
}

let isToggleRowSelection = false;
const handleSelectionChange = val => {
  checkedInvoiceRows.value = val;
  console.log('handleSelectionChange=====', val);

  if (!isToggleRowSelection) {
    invoice.value.rows.forEach(row => {
      row.checked = false;
    });
    val.forEach(row => {
      row.checked = true;
    });
    cacheInvoiceList();
  }
};

function getInvoiceList() {
  let invoiceList = localStorage.getItem('invoiceList');
  if (!invoiceList) {
    invoiceList = [];
  } else {
    invoiceList = JSON.parse(invoiceList);
  }
  return invoiceList;
}

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
  const result = Object.keys(invoice.value.rows[0]);
  if (result.indexOf('checked') !== -1) {
    result.splice(result.indexOf('checked'), 1);
  }
  invoiceHeads.value = result;
}

onMounted(() => {
  const { time } = route.query;
  invoice.value = getInvoiceList().find(i => i.time == time);
  if (invoice.value) {
    quotedprice.value = getQuotedpricelist().find(i => i.time == invoice.value.quotedpriceTime);

    if (!invoice.value.rows) {
      invoice.value.rows = quotedprice.value.rows;
    }

    setInvoiceHeads();
  } else {
    router.back();
    return;
  }

  nextTick(() => {
    isToggleRowSelection = true;
    invoice.value.rows.forEach(row => {
      if (row.checked) {
        invoiceTableRef.value.toggleRowSelection(row, undefined);
      }
    });
    isToggleRowSelection = false;
  });
});

function exportFile() {
  const rows = checkedInvoiceRows.value.map(row => {
    row = { ...row };
    delete row.checked;
    return row;
  });
  const ws = utils.json_to_sheet(rows);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Data');
  writeFileXLSX(wb, `${invoice.value.title}.xlsx`);
}

const find = () => {
  // router.push({
  //   path: '/dashboard/invoice',
  //   query: {
  //     ...form,
  //   },
  // });
};
const reset = () => {};
</script>

<style>
.invoice-row-container {
  height: 100vh;
}
.invoice-filter-container {
  display: flex;
}
.mr-10 {
  margin-right: 10px;
}
.mx-10 {
  margin: 0 10px;
}
.m-10 {
  margin: 10px;
}
</style>
