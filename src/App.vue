<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { useAppStore } from './store/app'

const appStore = useAppStore()

const currentLocale = computed(() => {
  return appStore.language === 'zh' ? zhCn : en
})
</script>
