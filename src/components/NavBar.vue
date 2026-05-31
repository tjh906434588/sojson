<template>
  <header class="navbar">
    <div class="navbar-container">
      <div class="navbar-left">
        <router-link to="/" class="logo">
          <el-icon :size="24"><Tools /></el-icon>
          <span class="logo-text">{{ $t('common.title') }}</span>
        </router-link>
      </div>
      
      <div class="navbar-menu" :class="{ 'is-active': isMobileMenuOpen }">
        <el-menu 
          :default-active="activeMenu" 
          mode="horizontal" 
          :ellipsis="false"
          @select="handleMenuSelect"
          class="nav-menu"
        >
          <el-sub-menu index="1">
            <template #title>{{ $t('menu.jsonTools') }}</template>
            <el-menu-item index="/json/json-parse">{{ $t('menu.jsonParse') }}</el-menu-item>
            <el-menu-item index="/json/json-compress">{{ $t('menu.jsonCompress') }}</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="2">
            <template #title>{{ $t('menu.encryptDecrypt') }}</template>
            <el-menu-item index="/encrypt/encrypt-decrypt">{{ $t('menu.encrypt') }}</el-menu-item>
            <el-menu-item index="/encrypt/hash">{{ $t('menu.hash') }}</el-menu-item>
            <el-menu-item index="/encrypt/base64">{{ $t('menu.base64') }}</el-menu-item>
            <el-menu-item index="/encrypt/image-base64">{{ $t('menu.imageBase64') }}</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="3">
            <template #title>{{ $t('menu.compressFormat') }}</template>
            <el-menu-item index="/compress/js-html-format">{{ $t('menu.jsHtmlFormat') }}</el-menu-item>
            <el-menu-item index="/compress/js-format">{{ $t('menu.jsFormat') }}</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="4">
            <template #title>{{ $t('menu.documents') }}</template>
            <el-menu-item index="/document/mime-type">{{ $t('menu.mimeType') }}</el-menu-item>
            <el-menu-item index="/document/html-escape">{{ $t('menu.htmlEscape') }}</el-menu-item>
            <el-menu-item index="/document/rgb-color">{{ $t('menu.rgbColor') }}</el-menu-item>
            <el-menu-item index="/document/public-dns">{{ $t('menu.publicDns') }}</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="5">
            <template #title>{{ $t('menu.frontend') }}</template>
            <el-menu-item index="/frontend/color-picker">{{ $t('menu.colorPicker') }}</el-menu-item>
            <el-menu-item index="/frontend/web-colors">{{ $t('menu.webColors') }}</el-menu-item>
            <el-menu-item index="/frontend/image-color">{{ $t('menu.imageColor') }}</el-menu-item>
            <el-menu-item index="/frontend/web-safe-color">{{ $t('menu.webSafeColor') }}</el-menu-item>
            <el-menu-item index="/frontend/color-selector">{{ $t('menu.colorSelector') }}</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="6">
            <template #title>{{ $t('menu.convert') }}</template>
            <el-menu-item index="/convert/case-convert">{{ $t('menu.caseConvert') }}</el-menu-item>
            <el-menu-item index="/convert/full-half-convert">{{ $t('menu.fullHalfConvert') }}</el-menu-item>
            <el-menu-item index="/convert/lang-convert">{{ $t('menu.langConvert') }}</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="7">
            <template #title>{{ $t('menu.qrcode') }}</template>
            <el-menu-item index="/qrcode/qrcode-gen">{{ $t('menu.qrcodeGen') }}</el-menu-item>
            <el-menu-item index="/qrcode/qrcode-beautify">{{ $t('menu.qrcodeBeautify') }}</el-menu-item>
            <el-menu-item index="/qrcode/qrcode-parse">{{ $t('menu.qrcodeParse') }}</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="8">
            <template #title>{{ $t('menu.webmaster') }}</template>
            <el-menu-item index="/webmaster/linux-cmd">{{ $t('menu.linuxCmd') }}</el-menu-item>
            <el-menu-item index="/webmaster/seo-tool">{{ $t('menu.seoTool') }}</el-menu-item>
            <el-menu-item index="/webmaster/js-lib">{{ $t('menu.jsLib') }}</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="9">
            <template #title>{{ $t('menu.lifeTool') }}</template>
            <el-menu-item index="/life/date-calc">{{ $t('menu.dateCalc') }}</el-menu-item>
            <el-menu-item index="/life/stopwatch">{{ $t('menu.stopwatch') }}</el-menu-item>
            <el-menu-item index="/life/festival">{{ $t('menu.festival') }}</el-menu-item>
            <el-menu-item index="/life/postal-code">{{ $t('menu.postalCode') }}</el-menu-item>
            <el-menu-item index="/life/mix-rate">{{ $t('menu.mixRate') }}</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="10">
            <template #title>{{ $t('menu.culture') }}</template>
            <el-menu-item index="/culture/periodic-table">{{ $t('menu.periodicTable') }}</el-menu-item>
            <el-menu-item index="/culture/sentence-trans">{{ $t('menu.sentenceTrans') }}</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="11">
            <template #title>{{ $t('menu.otherTools') }}</template>
            <el-menu-item index="/other/algebra">{{ $t('menu.algebra') }}</el-menu-item>
            <el-menu-item index="/other/image-tool">{{ $t('menu.imageTool') }}</el-menu-item>
            <el-menu-item index="/other/sudoku">{{ $t('menu.sudoku') }}</el-menu-item>
            <el-menu-item index="/other/about">{{ $t('menu.about') }}</el-menu-item>
            <el-menu-item index="/other/privacy">{{ $t('menu.privacy') }}</el-menu-item>
            <el-menu-item index="/other/contact">{{ $t('menu.contact') }}</el-menu-item>
            <el-menu-item index="/other/feedback">{{ $t('menu.feedback') }}</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      
      <div class="navbar-right">
        <el-select 
          v-model="selectedLang" 
          @change="handleLanguageChange" 
          class="lang-selector"
        >
          <el-option :label="$t('common.zh_CN')" value="zh" />
          <el-option :label="$t('common.en_US')" value="en" />
        </el-select>
        <el-button 
          :icon="Menu" 
          circle 
          @click="toggleMobileMenu"
          class="mobile-menu-button"
        />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../store/app'
import { Menu, Tools } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const { locale } = useI18n()
const appStore = useAppStore()

const selectedLang = ref(locale.value)
const isMobileMenuOpen = ref(false)
const isMobile = ref(false)

const activeMenu = computed(() => route.path)

const handleLanguageChange = (lang) => {
  locale.value = lang
  appStore.setLanguage(lang)
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleMenuSelect = (index) => {
  router.push(index)
  if (isMobile.value) {
    isMobileMenuOpen.value = false
  }
}

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    isMobileMenuOpen.value = false
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped lang="scss">
.navbar {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

.navbar-container {
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  max-width: 1400px;
  box-sizing: border-box;
}

.navbar-left {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  
  .logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #409eff;
    
    .logo-text {
      margin-left: 8px;
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      white-space: nowrap;
    }
  }
}

.navbar-menu {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  max-width: calc(100% - 300px);
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  
  &::-webkit-scrollbar {
    height: 0;
  }
  
  &:hover {
    scrollbar-width: thin;
    scrollbar-color: #c0c4cc transparent;
    
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c0c4cc;
      border-radius: 2px;
    }
  }
  
  .nav-menu {
    border-bottom: none;
    display: flex;
    flex-wrap: nowrap;
    white-space: nowrap;
  }
}

.navbar-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 10px;
  
  .lang-selector {
    width: 100px;
  }
  
  .mobile-menu-button {
    display: none;
  }
}

@media (max-width: 768px) {
  .navbar {
    height: auto;
    min-height: 60px;
  }
  
  .navbar-container {
    height: auto;
    min-height: 60px;
    padding: 0 15px;
    flex-wrap: wrap;
  }
  
  .navbar-menu {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin: 0;
    padding: 20px;
    transform: translateY(-100%);
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
    z-index: 999;
    max-height: calc(100vh - 60px);
    overflow-y: auto;
    max-width: 100%;
    flex-wrap: wrap;
    justify-content: flex-start;
    
    &.is-active {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }
    
    :deep(.el-menu) {
      flex-direction: column;
      border-right: none;
    }
    
    :deep(.el-sub-menu) {
      .el-menu {
        box-shadow: none;
        border: none;
        padding-left: 20px;
      }
    }
  }
  
  .navbar-right {
    .mobile-menu-button {
      display: flex;
    }
    
    .lang-selector {
      width: 80px;
    }
  }
}
</style>
