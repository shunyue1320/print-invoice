import { createRouter, createWebHashHistory } from 'vue-router';

export const Layout = () => import('../layout/index.vue');

export const constantRouterMap = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/invoice',
    name: 'Root',
    meta: {
      hidden: true,
    },
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/invoice',
    name: 'Dashboard',
    meta: {
      title: 'Dashboard',
      icon: 'ant-design:dashboard-filled',
      alwaysShow: true,
    },
    children: [
      {
        path: 'invoice',
        component: () => import('../views/dashboard/invoice/index.vue'),
        name: '发货单',
        meta: {
          title: '发货单',
        },
      },
      {
        path: 'invoicedetails',
        component: () => import('../views/dashboard/invoice/details.vue'),
        name: '发货单详情',
        meta: {
          title: '发货单详情',
        },
      },
      {
        path: 'quotedprice',
        component: () => import('../views/dashboard/quotedprice/index.vue'),
        name: '报价单',
        meta: {
          title: '报价单',
          affix: true,
        },
      },
      {
        path: 'quotedpricedetails',
        component: () => import('../views/dashboard/quotedprice/details.vue'),
        name: '报价单详情',
        meta: {
          title: '报价单详情',
          affix: true,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export default router;
