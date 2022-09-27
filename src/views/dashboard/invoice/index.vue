<template>
  <div>
    <el-button type="primary" @click="dialogFormVisible = true" style="margin: 10px">
      添加发货单
    </el-button>

    <el-dialog v-model="dialogFormVisible" title="Shipping address">
      <el-form :model="form">
        <el-form-item label="Promotion name" label-width="200px">
          <el-input v-model="form.title" placeholder="请输入发货单标题" style="width: 250px" />
        </el-form-item>
        <el-form-item label="Zones" label-width="200px">
          <el-select
            v-model="form.quotedpriceTime"
            placeholder="请选择发货单对应的报价单"
            style="width: 250px"
          >
            <el-option
              v-for="item in quotedpricelist"
              :key="item.time"
              :label="item.title"
              :value="item.time"
            />
            <el-option label="Zone No.2" value="beijing" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addInvoice">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const dialogFormVisible = ref(false);
const quotedpricelist = ref([]);
const invoicelist = ref([]);
const form = reactive({
  title: '',
  quotedpriceTime: '',
});

function getQuotedpricelist() {
  let quotedpricelist = localStorage.getItem('quotedpricelist');
  if (!quotedpricelist) {
    quotedpricelist = [];
  } else {
    quotedpricelist = JSON.parse(quotedpricelist);
  }
  return quotedpricelist;
}

function getInvoiceList() {
  let invoiceList = localStorage.getItem('invoiceList');
  if (!invoiceList) {
    invoiceList = [];
  } else {
    invoiceList = JSON.parse(invoiceList);
  }
  return invoiceList;
}

onMounted(() => {
  quotedpricelist.value = getQuotedpricelist();
  invoicelist.value = getInvoiceList();
});

const router = useRouter();
const addInvoice = () => {
  dialogFormVisible.value = false;

  const time = new Date().getTime();
  invoicelist.value.push({
    title: form.title,
    quotedpriceTime: form.quotedpriceTime,
    time,
    rows: null,
  });
  localStorage.setItem('invoiceList', JSON.stringify(invoicelist.value));

  router.push({
    path: '/dashboard/invoiceDetails',
    query: { time },
  });
};
</script>
