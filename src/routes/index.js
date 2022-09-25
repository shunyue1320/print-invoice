import { createRouter, createWebHashHistory } from 'vue-router';

export const Layout = () => import('/layout/Layout.vue');

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
        component: () => import('@/views/dashboard/invoice.vue'),
        name: '发货单',
        meta: {
          title: t('router.workplace'),
        },
      },
      {
        path: 'quotedprice',
        component: () => import('@/views/dashboard/quotedprice.vue'),
        name: '报价单',
        meta: {
          title: t('router.analysis'),
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
