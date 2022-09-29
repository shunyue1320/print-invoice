<template>
  <div>
    <el-row class="invoice-row-container">
      <el-col :span="12" style="border-right: 1px solid #eceef4">
        <h3 style="text-align: center">{{ quotedprice.title }}</h3>
        <div class="invoice-filter-container">
          <el-input
            v-model="searchKeyWord"
            class="search-input"
            placeholder="输入关键字例如：丝瓜 芥兰苗"
          />
          <el-button-group>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-button-group>
        </div>
        <el-table
          v-show="searchInvoiceRows.length === 0"
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

        <el-table
          v-show="searchInvoiceRows.length > 0"
          ref="searchInvoiceTableRef"
          :data="searchInvoiceRows"
          style="width: 100%"
          @selection-change="handleSearchSelectionChange"
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
          :data="selectedInvoiceRows"
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
import { ref, onMounted, unref, nextTick, watch, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { utils, writeFileXLSX } from 'xlsx';

const route = useRoute();
const router = useRouter();

const invoiceTableRef = ref();
const searchInvoiceTableRef = ref();
const searchKeyWord = ref('');

const invoice = ref({
  title: null,
  time: null,
  rows: null,
});
const invoiceHeads = ref([]);
const selectedIds = ref([]);
const selectedInvoiceRows = ref([]);
const searchInvoiceRows = ref([]);
const quotedprice = ref({});

function cacheInvoiceList() {
  const invoiceList = getInvoiceList();
  const cacheInvoice = invoiceList.find(i => i.time == invoice.value.time);
  cacheInvoice.rows = invoice.value.rows;
  cacheInvoice.selectedIds = selectedIds.value;

  localStorage.setItem('invoiceList', JSON.stringify(unref(invoiceList)));
}

watch(
  () => selectedIds.value,
  () => {
    selectedInvoiceRows.value = invoice.value.rows.filter(i => selectedIds.value.includes(i._id));
    cacheInvoiceList();
  },
);

let isToggleRowSelection = false;
const handleSelectionChange = val => {
  if (!isToggleRowSelection) {
    selectedIds.value = val.map(i => i._id);
  }
};

let oldSearchSelectedIds = [];
const handleSearchSelectionChange = val => {
  let newSearchSelectedIds = [];
  if (!isToggleRowSelection && searchInvoiceRows.value.length > 0) {
    newSearchSelectedIds = val.map(i => i._id);
    // del
    oldSearchSelectedIds.forEach(oldId => {
      if (!newSearchSelectedIds.includes(oldId)) {
        selectedIds.value = selectedIds.value.filter(i => i !== oldId);
      }
    });
    // add
    newSearchSelectedIds.forEach(newId => {
      if (!oldSearchSelectedIds.includes(newId)) {
        if (!selectedIds.value.includes(newId)) {
          selectedIds.value = [...selectedIds.value, newId];
        }
      }
    });
    // val.forEach(row => {
    //   if (!selectedIds.value.includes(row._id)) {
    //     selectedInvoiceRows.value.push(row);
    //     selectedIds.value.push(row._id);
    //   }
    // });
  }
  oldSearchSelectedIds = val.map(i => i._id);
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
  invoiceHeads.value = Object.keys(invoice.value.rows[0]).filter(i => i !== '_id');
}

onMounted(() => {
  const { time } = route.query;
  invoice.value = getInvoiceList().find(i => i.time == time);
  if (invoice.value) {
    quotedprice.value = getQuotedpricelist().find(i => i.time == invoice.value.quotedpriceTime);

    if (!invoice.value.rows) {
      invoice.value.rows = quotedprice.value.rows;
    }
    if (invoice.value.selectedIds) {
      selectedIds.value = invoice.value.selectedIds;
    }

    setInvoiceHeads();
  } else {
    router.back();
    return;
  }

  nextTick(() => {
    if (invoice.value.selectedIds) {
      isToggleRowSelection = true;
      invoice.value.rows.forEach(row => {
        if (invoice.value.selectedIds.includes(row._id)) {
          invoiceTableRef.value.toggleRowSelection(row, undefined);
        }
      });
      isToggleRowSelection = false;
    }
  });
});

function exportFile() {
  const rows = selectedInvoiceRows.value.map(row => {
    row = { ...row };
    delete row._id;
    return row;
  });
  const ws = utils.json_to_sheet(rows);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Data');
  writeFileXLSX(wb, `${invoice.value.title}.xlsx`);
}

const search = () => {
  if (searchKeyWord.value) {
    searchInvoiceRows.value = invoice.value.rows.filter(row =>
      JSON.stringify(row).includes(searchKeyWord.value),
    );
  } else {
    searchInvoiceRows.value = [];
  }

  if (searchInvoiceRows.value.length > 0 && selectedIds.value.length > 0) {
    nextTick(() => {
      isToggleRowSelection = true;
      searchInvoiceTableRef.value.clearSelection();
      searchInvoiceRows.value.forEach(row => {
        if (selectedIds.value.includes(row._id)) {
          searchInvoiceTableRef.value.toggleRowSelection(row, undefined);
        }
      });
      isToggleRowSelection = false;
    });
  } else if (searchInvoiceRows.value.length === 0) {
    nextTick(() => {
      isToggleRowSelection = true;
      console.log('selectedIds.value ==', selectedIds.value);
      invoiceTableRef.value.clearSelection();
      invoice.value.rows.forEach(row => {
        if (selectedIds.value.includes(row._id)) {
          invoiceTableRef.value.toggleRowSelection(row, undefined);
        }
      });
      isToggleRowSelection = false;
    });
  }
};

let timer = null;
watch(
  () => searchKeyWord.value,
  () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      clearTimeout(timer);
      search();
    }, 500);
  },
);

const reset = () => {
  searchKeyWord.value = '';
};
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
.search-input {
  width: 350px;
  margin: 0 10px;
}
.m-10 {
  margin: 10px;
}
</style>
