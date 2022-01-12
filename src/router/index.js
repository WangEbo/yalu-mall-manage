import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  }
]

//超管独有路由
// export const adminRoute =  {
//   path: '/ums',
//   component: Layout,
//   redirect: '/ums/admin',
//   name: 'ums',
//   meta: { title: '管理员管理', icon: 'ums' },
//   children: [
//     {
//       path: 'admin',
//       name: 'admin',
//       component: () => import('@/views/ums/admin'),
//       meta: { title: '管理员列表', icon: 'ums-admin' }
//     },
//   ]
// }

//其他异步路由
export const asyncRouterMap = [
  {
    path: '/ums',
    component: Layout,
    redirect: '/ums/admin',
    name: 'ums',
    meta: { title: '管理员管理', icon: 'ums' },
    children: [
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/ums/admin'),
        meta: { title: '管理员列表', icon: 'ums-admin' }
      },
    ]
  },


  {
    path: '/set',
    component: Layout,
    redirect: '/set/universal',
    name: 'set',
    meta: { title: '通用设置', icon: 'set' },
    children: [
      {
        path: 'universal',
        name: 'set-universal',
        component: () => import('@/views/set/universal'),
        meta: { title: '通用设置', icon: 'set-universal' }
      },
    ]
  },


  {
    path: '/info',
    component: Layout,
    redirect: '/info/news',
    name: 'info',
    meta: { title: '信息管理', icon: 'info' },
    children: [
      {
        path: 'overview',
        name: 'info-overview',
        component: () => import('@/views/info/overview'),
        meta: { title: '品牌概况', icon: 'info-overview' }
      },
      {
        path: 'csr',
        name: 'info-csr',
        component: () => import('@/views/info/csr'),
        meta: { title: '社会责任', icon: 'info-csr' }
      },
      {
        path: 'brand',
        name: 'info-brand',
        component: () => import('@/views/info/brand'),
        meta: { title: '品牌历程', icon: 'info-brand' }
      },
      {
        path: 'news',
        name: 'info-news',
        component: () => import('@/views/info/news'),
        meta: { title: '资讯管理', icon: 'info-news' }
      },
    ]
  },


  {
    path: '/pms',
    component: Layout,
    redirect: '/pms/product',
    name: 'pms',
    meta: { title: '商品管理', icon: 'product' },
    children: [
      {
        path: 'product',
        name: 'product-list',
        component: () => import('@/views/pms/product/index'),
        meta: { title: '商品列表', icon: 'product-list' }
      },
      {
        path: 'addProduct',
        name: 'addProduct',
        component: () => import('@/views/pms/product/add'),
        meta: {title: '添加商品', icon: 'product-add'},
        hidden: true
      },
      {
        path: 'cate',
        name: 'product-cate',
        component: () => import('@/views/pms/productCate/index'),
        meta: { title: '分类管理', icon: 'product-cate' }
      },
      {
        path: 'addProductCate',
        name: 'addProductCate',
        component: () => import('@/views/pms/productCate/add'),
        meta: { title: '添加商品分类' },
        hidden: true
      },
      {
        path: 'updateProductCate',
        name: 'updateProductCate',
        component: () => import('@/views/pms/productCate/update'),
        meta: { title: '修改商品分类' },
        hidden: true
      },
      {
        path: 'productAttr',
        name: 'productAttr',
        component: () => import('@/views/pms/productAttr/index'),
        meta: { title: '商品类型', icon: 'product-attr' }
      },
      {
        path: 'productAttrList',
        name: 'productAttrList',
        component: () => import('@/views/pms/productAttr/productAttrList'),
        meta: { title: '商品属性列表' },
        hidden: true
      },
      {
        path: 'addProductAttr',
        name: 'addProductAttr',
        component: () => import('@/views/pms/productAttr/addProductAttr'),
        meta: { title: '添加商品属性' },
        hidden: true
      },
      {
        path: 'updateProductAttr',
        name: 'updateProductAttr',
        component: () => import('@/views/pms/productAttr/updateProductAttr'),
        meta: { title: '修改商品属性' },
        hidden: true
      },
      {
        path: 'brand',
        name: 'brand',
        component: () => import('@/views/pms/brand/index'),
        meta: { title: '品牌管理', icon: 'product-brand' }
      },
      {
        path: 'addBrand',
        name: 'addBrand',
        component: () => import('@/views/pms/brand/add'),
        meta: { title: '添加品牌' },
        hidden: true
      },
      {
        path: 'updateBrand',
        name: 'updateBrand',
        component: () => import('@/views/pms/brand/update'),
        meta: { title: '编辑品牌' },
        hidden: true
      }
    ]
  },

  {
    path: '/carousel',
    component: Layout,
    redirect: '/carousel/coupon',
    name: 'carousel',
    meta: { title: '轮播管理', icon: 'carousel' },
    children: [
      {
        path: 'index',
        name: 'carousel-index',
        component: () => import('@/views/carousel/index'),
        meta: { title: '首页首屏轮播', icon: 'carousel-index' }
      },
      {
        path: 'cate',
        name: 'carousel-cate',
        component: () => import('@/views/carousel/cate'),
        meta: { title: '分类轮播' },
        hidden: true
      },
      {
        path: 'news',
        name: 'carousel-news',
        component: () => import('@/views/carousel/news'),
        meta: { title: '资讯轮播' },
        hidden: true
      },
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
