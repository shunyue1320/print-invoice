<template>
  <div>
    <el-button type="primary" @click="dialogFormVisible = true" style="margin: 10px">
      添加发货单
    </el-button>

    <div class="invoice-container">
      <el-card v-for="item in invoicelist" :key="item.time" class="invoice-card">
        <template #header>
          <div class="card-header">
            <span>{{ item.title }}</span>
            <el-button-group class="ml-4">
              <el-button
                :icon="Edit"
                @click="
                  router.push({ path: '/dashboard/invoicedetails', query: { time: item.time } })
                "
              />
              <!-- <el-button :icon="Delete" @click="deleteInvoice(item.time)" /> -->
              <el-popconfirm title="确定删除此发货单吗?" @confirm="deleteInvoice(item.time)">
                <template #reference>
                  <el-button :icon="Delete" />
                </template>
              </el-popconfirm>
            </el-button-group>
          </div>
        </template>
        <div class="card-content">
          <div>
            发货量：<span>{{ item.selectedIds ? item.selectedIds.length : 0 }}</span>
          </div>
          <div>创建日期：{{ dayjs(item.time).format('YYYY-MM-DD HH:mm') }}</div>
        </div>
      </el-card>
    </div>

    <el-dialog v-model="dialogFormVisible" title="添加发货单" width="500px">
      <el-form :model="form">
        <el-form-item label="发货单标题" label-width="200px">
          <el-input v-model="form.title" placeholder="请输入发货单标题" style="width: 250px" />
        </el-form-item>
        <el-form-item label="关联报价单" label-width="200px">
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
import dayjs from 'dayjs';
import { Delete, Edit } from '@element-plus/icons-vue';

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
  const time = new Date().getTime();
  invoicelist.value.push({
    title: form.title,
    quotedpriceTime: form.quotedpriceTime,
    time,
    rows: null,
  });
  localStorage.setItem('invoiceList', JSON.stringify(invoicelist.value));
  dialogFormVisible.value = false;

  router.push({
    path: '/dashboard/invoiceDetails',
    query: { time },
  });
};

const deleteInvoice = time => {
  let invoiceList = getInvoiceList();
  invoiceList = invoiceList.filter(item => item.time !== time);
  localStorage.setItem('invoiceList', JSON.stringify(invoiceList));
  invoicelist.value = getInvoiceList();
};
</script>

<style>
.invoice-container {
  display: flex;
  flex-wrap: wrap;
}
.invoice-card {
  width: 300px;
  margin: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
