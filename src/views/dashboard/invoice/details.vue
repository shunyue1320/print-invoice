<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-table
          ref="multipleTableRef"
          :data="quotedprice.rows"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            v-for="(name, index) in quotedpriceHeads"
            :key="index"
            :label="name"
            :property="name"
            width="100"
          />
        </el-table>
      </el-col>
      <el-col :span="12"> </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();

const invoice = ref(null);
const invoiceRows = ref(null);
const quotedprice = ref([]);
const quotedpriceHeads = ref([]);

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

onMounted(() => {
  const { time } = route.query;
  invoice.value = getInvoiceList().find(i => i.time == time);
  if (invoice.value) {
    quotedprice.value = getQuotedpricelist().find(i => i.time == invoice.value.quotedpriceTime);
    quotedpriceHeads.value = Object.keys(quotedprice.value.rows[0]);
  } else {
    router.back();
  }
  console.log('invoiceList.value===', invoice.value);
  console.log('quotedpricelist.value====', quotedprice.value);
});

const handleSelectionChange = val => {
  quotedprice.value.rows.forEach(row => {
    row.checked = false;
  });
  val.forEach(row => {
    row.checked = true;
  });
  cache;
};

const gotoInvoiceDetails = () => {
  dialogFormVisible.value = false;
  router.push({
    path: '/dashboard/invoice',
    query: {
      ...form,
    },
  });
};
</script>
