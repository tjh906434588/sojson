import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/json/json-parse',
    name: 'JsonParse',
    component: () => import('../views/json/JsonParse.vue')
  },
  {
    path: '/json/json-compress',
    name: 'JsonCompress',
    component: () => import('../views/json/JsonCompress.vue')
  },
  {
    path: '/encrypt/encrypt-decrypt',
    name: 'EncryptDecrypt',
    component: () => import('../views/encrypt/EncryptDecrypt.vue')
  },
  {
    path: '/encrypt/hash',
    name: 'Hash',
    component: () => import('../views/encrypt/Hash.vue')
  },
  {
    path: '/encrypt/base64',
    name: 'Base64',
    component: () => import('../views/encrypt/Base64.vue')
  },
  {
    path: '/encrypt/image-base64',
    name: 'ImageBase64',
    component: () => import('../views/encrypt/ImageBase64.vue')
  },
  {
    path: '/compress/js-html-format',
    name: 'JsHtmlFormat',
    component: () => import('../views/compress/JsHtmlFormat.vue')
  },
  {
    path: '/compress/js-format',
    name: 'JsFormat',
    component: () => import('../views/compress/JsFormat.vue')
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
    path: '/frontend/color-picker',
    name: 'ColorPicker',
    component: () => import('../views/frontend/ColorPicker.vue')
  },
  {
    path: '/frontend/web-colors',
    name: 'WebColors',
    component: () => import('../views/frontend/WebColors.vue')
  },
  {
    path: '/frontend/image-color',
    name: 'ImageColor',
    component: () => import('../views/frontend/ImageColor.vue')
  },
  {
    path: '/frontend/web-safe-color',
    name: 'WebSafeColor',
    component: () => import('../views/frontend/WebSafeColor.vue')
  },
  {
    path: '/frontend/color-selector',
    name: 'ColorSelector',
    component: () => import('../views/frontend/ColorSelector.vue')
  },
  {
    path: '/convert/case-convert',
    name: 'CaseConvert',
    component: () => import('../views/convert/CaseConvert.vue')
  },
  {
    path: '/convert/full-half-convert',
    name: 'FullHalfConvert',
    component: () => import('../views/convert/FullHalfConvert.vue')
  },
  {
    path: '/convert/lang-convert',
    name: 'LangConvert',
    component: () => import('../views/convert/LangConvert.vue')
  },
  {
    path: '/qrcode/qrcode-gen',
    name: 'QrcodeGen',
    component: () => import('../views/qrcode/QrcodeGen.vue')
  },
  {
    path: '/qrcode/qrcode-beautify',
    name: 'QrcodeBeautify',
    component: () => import('../views/qrcode/QrcodeBeautify.vue')
  },
  {
    path: '/qrcode/qrcode-parse',
    name: 'QrcodeParse',
    component: () => import('../views/qrcode/QrcodeParse.vue')
  },
  {
    path: '/webmaster/linux-cmd',
    name: 'LinuxCmd',
    component: () => import('../views/webmaster/LinuxCmd.vue')
  },
  {
    path: '/webmaster/seo-tool',
    name: 'SeoTool',
    component: () => import('../views/webmaster/SeoTool.vue')
  },
  {
    path: '/webmaster/js-lib',
    name: 'JsLib',
    component: () => import('../views/webmaster/JsLib.vue')
  },
  {
    path: '/life/date-calc',
    name: 'DateCalc',
    component: () => import('../views/life/DateCalc.vue')
  },
  {
    path: '/life/stopwatch',
    name: 'Stopwatch',
    component: () => import('../views/life/Stopwatch.vue')
  },
  {
    path: '/life/festival',
    name: 'Festival',
    component: () => import('../views/life/Festival.vue')
  },
  {
    path: '/life/postal-code',
    name: 'PostalCode',
    component: () => import('../views/life/PostalCode.vue')
  },
  {
    path: '/life/mix-rate',
    name: 'MixRate',
    component: () => import('../views/life/MixRate.vue')
  },
  {
    path: '/culture/periodic-table',
    name: 'PeriodicTable',
    component: () => import('../views/culture/PeriodicTable.vue')
  },
  {
    path: '/culture/sentence-trans',
    name: 'SentenceTrans',
    component: () => import('../views/culture/SentenceTrans.vue')
  },
  {
    path: '/other/algebra',
    name: 'Algebra',
    component: () => import('../views/other/Algebra.vue')
  },
  {
    path: '/other/image-tool',
    name: 'ImageTool',
    component: () => import('../views/other/ImageTool.vue')
  },
  {
    path: '/other/sudoku',
    name: 'Sudoku',
    component: () => import('../views/other/Sudoku.vue')
  },
  {
    path: '/other/about',
    name: 'About',
    component: () => import('../views/other/About.vue')
  },
  {
    path: '/other/privacy',
    name: 'Privacy',
    component: () => import('../views/other/Privacy.vue')
  },
  {
    path: '/other/contact',
    name: 'Contact',
    component: () => import('../views/other/Contact.vue')
  },
  {
    path: '/other/feedback',
    name: 'Feedback',
    component: () => import('../views/other/Feedback.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
