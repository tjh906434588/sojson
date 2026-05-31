<template>
  <el-config-provider :locale="currentLocale">
    <div id="app">
      <NavBar />
      <main class="main-content">
        <router-view />
      </main>
      <FooterBar />
    </div>
  </el-config-provider>
</template>

<script setup>
import { computed } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'
import { useAppStore } from './store/app'
import i18n from './locales'

const appStore = useAppStore()

const currentLocale = computed(() => {
  return appStore.language === 'zh' ? zhCn : en
})
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

.main-content {
  flex: 1;
  padding: 20px 0;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

html, body {
  max-width: 100%;
  overflow-x: hidden;
}
</style>
