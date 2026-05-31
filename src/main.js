import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import App from './App.vue'
import './styles/global.scss'
import i18n from './locales'

const app = createApp(App)
const pinia = createPinia()

const elementLocales = {
  zh: zhCn,
  en: en
}

const initialLocale = i18n.global.locale.value
app.use(pinia)
app.use(router)
app.use(i18n)
app.use(ElementPlus, {
  locale: elementLocales[initialLocale]
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
