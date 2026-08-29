import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/json',
    name: 'JsonTools',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/json/json-parse',
    name: 'JsonParse',
    component: () => import('../views/json/JsonParse.vue')
  },
  {
    path: '/json/json-online-parse',
    name: 'JsonOnlineParse',
    component: () => import('../views/json/JsonOnlineParse.vue')
  },
  {
    path: '/json/json-compress-escape',
    name: 'JsonCompressEscape',
    component: () => import('../views/json/JsonCompressEscape.vue')
  },
  {
    path: '/json/json-online-view',
    name: 'JsonOnlineView',
    component: () => import('../views/json/JsonOnlineView.vue')
  },
  {
    path: '/json/json-color',
    name: 'JsonColor',
    component: () => import('../views/json/JsonColor.vue')
  },
  {
    path: '/json/json-xml',
    name: 'JsonXml',
    component: () => import('../views/json/JsonXml.vue')
  },
  {
    path: '/json/json-compare',
    name: 'JsonCompare',
    component: () => import('../views/json/JsonCompare.vue')
  },
  {
    path: '/json/json-entity',
    name: 'JsonEntity',
    component: () => import('../views/json/JsonEntity.vue')
  },
  {
    path: '/json/json-excel',
    name: 'JsonExcel',
    component: () => import('../views/json/JsonExcel.vue')
  },
  {
    path: '/encrypt',
    name: 'EncryptTools',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/encrypt/encrypt-decrypt',
    name: 'EncryptDecrypt',
    component: () => import('../views/encrypt/EncryptDecrypt.vue')
  },
  {
    path: '/encrypt/js-encrypt-decrypt',
    name: 'JsEncryptDecrypt',
    component: () => import('../views/encrypt/JsEncryptDecrypt.vue')
  },
  {
    path: '/compress',
    name: 'CompressTools',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/compress/js-html-format',
    name: 'JsHtmlFormat',
    component: () => import('../views/compress/JsHtmlFormat.vue')
  },
  {
    path: '/document',
    name: 'DocumentTools',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/document/mime-type',
    name: 'MimeType',
    component: () => import('../views/document/MimeType.vue')
  },
  {
    path: '/document/html-escape',
    name: 'HtmlEscape',
    component: () => import('../views/document/HtmlEscape.vue')
  },
  {
    path: '/document/rgb-color',
    name: 'RgbColor',
    component: () => import('../views/document/RgbColor.vue')
  },
  {
    path: '/document/public-dns',
    name: 'PublicDns',
    component: () => import('../views/document/PublicDns.vue')
  },
  {
    path: '/frontend',
    name: 'FrontendTools',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/frontend/web-colors',
    name: 'WebColors',
    component: () => import('../views/frontend/WebColors.vue')
  },
  {
    path: '/convert',
    name: 'ConvertTools',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/convert/case-convert',
    name: 'CaseConvert',
    component: () => import('../views/convert/CaseConvert.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
