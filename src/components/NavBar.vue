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
          :mode="isMobile ? 'vertical' : 'horizontal'"
          :ellipsis="false"
          @select="handleMenuSelect"
          class="nav-menu"
        >
          <!-- H5：一级菜单（右侧图标展开二级 + 文字跳转） -->
          <template v-if="isMobile">
            <template v-for="group in menus" :key="group.key">
              <div class="mobile-menu-group" :class="{ 'is-hidden': group.hidden }">
                <div class="mobile-menu-top" :class="{ 'is-active': isGroupActive(group) }">
                  <div class="mobile-menu-label" @click="goGroup(group)">
                    <el-icon><component :is="group.icon" /></el-icon>
                    <span>{{ $t(group.title) }}</span>
                  </div>
                  <el-icon class="mobile-menu-toggle" @click="toggleMobileSubMenu(group.key)">
                    <ArrowDown v-if="!mobileSubOpenMap[group.key]" />
                    <ArrowUp v-else />
                  </el-icon>
                </div>
                <template v-if="mobileSubOpenMap[group.key]">
                  <el-menu-item
                    v-for="item in group.items"
                    :key="item.path"
                    :index="item.path"
                    class="mobile-sub-item"
                  >{{ $t(item.label) }}</el-menu-item>
                </template>
              </div>
            </template>
          </template>

          <!-- Web：一级菜单 -->
          <template v-else>
            <el-sub-menu
              v-for="group in menus"
              :key="group.key"
              :index="group.key"
              :class="{ 'is-hidden': group.hidden }"
            >
              <template #title>
                <div class="menu-title" @click="goGroup(group)">
                  <el-icon><component :is="group.icon" /></el-icon>
                  <span>{{ $t(group.title) }}</span>
                </div>
              </template>
              <el-menu-item
                v-for="item in group.items"
                :key="item.path"
                :index="item.path"
              >{{ $t(item.label) }}</el-menu-item>
            </el-sub-menu>
          </template>
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

    <!-- H5：菜单展开时覆盖下方页面，聚焦菜单 -->
    <div
      v-if="isMobile"
      class="menu-mask"
      :class="{ 'is-active': isMobileMenuOpen }"
      @click="toggleMobileMenu"
    ></div>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../store/app'
import {
  ArrowDown, ArrowUp, Menu, Tools,
  Lock, Operation, Document, Monitor, Switch, MagicStick, Guide, CoffeeCup, Trophy, MoreFilled
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const { locale } = useI18n()
const appStore = useAppStore()

const selectedLang = ref(locale.value)
const isMobileMenuOpen = ref(false)
// H5：各一级菜单的二级展开状态（key: boolean）
const mobileSubOpenMap = ref({})
const isMobile = ref(false)

// 一级菜单数据；hidden: true 表示“屏蔽”——保留但隐藏，不参与展示
const menus = [
  {
    key: 'json',
    title: 'menu.jsonTools',
    icon: Tools,
    link: '/json',
    exact: ['/', '/json'],
    prefix: '/json',
    hidden: false,
    items: [
      { path: '/json/json-parse', label: 'menu.jsonParse' },
      { path: '/json/json-online-parse', label: 'menu.jsonOnlineParse' },
      { path: '/json/json-compress-escape', label: 'menu.jsonCompressEscape' },
      { path: '/json/json-online-view', label: 'menu.jsonOnlineView' },
      { path: '/json/json-color', label: 'menu.jsonColor' },
      { path: '/json/json-xml', label: 'menu.jsonXmlConvert' },
      { path: '/json/json-compare', label: 'menu.jsonCompare' },
      { path: '/json/json-entity', label: 'menu.jsonEntity' },
      { path: '/json/json-excel', label: 'menu.jsonExcel' }
    ]
  },
  {
    key: 'encrypt',
    title: 'menu.encryptDecrypt',
    icon: Lock,
    link: '/encrypt/encrypt-decrypt',
    prefix: '/encrypt',
    hidden: true,
    items: [
      { path: '/encrypt/encrypt-decrypt', label: 'menu.encrypt' },
      { path: '/encrypt/hash', label: 'menu.hash' },
      { path: '/encrypt/base64', label: 'menu.base64' },
      { path: '/encrypt/image-base64', label: 'menu.imageBase64' }
    ]
  },
  {
    key: 'compress',
    title: 'menu.compressFormat',
    icon: Operation,
    link: '/compress/js-html-format',
    prefix: '/compress',
    hidden: true,
    items: [
      { path: '/compress/js-html-format', label: 'menu.jsHtmlFormat' },
      { path: '/compress/js-format', label: 'menu.jsFormat' }
    ]
  },
  {
    key: 'documents',
    title: 'menu.documents',
    icon: Document,
    link: '/document/mime-type',
    prefix: '/document',
    hidden: true,
    items: [
      { path: '/document/mime-type', label: 'menu.mimeType' },
      { path: '/document/html-escape', label: 'menu.htmlEscape' },
      { path: '/document/rgb-color', label: 'menu.rgbColor' },
      { path: '/document/public-dns', label: 'menu.publicDns' }
    ]
  },
  {
    key: 'frontend',
    title: 'menu.frontend',
    icon: Monitor,
    link: '/frontend/color-picker',
    prefix: '/frontend',
    hidden: true,
    items: [
      { path: '/frontend/color-picker', label: 'menu.colorPicker' },
      { path: '/frontend/web-colors', label: 'menu.webColors' },
      { path: '/frontend/image-color', label: 'menu.imageColor' },
      { path: '/frontend/web-safe-color', label: 'menu.webSafeColor' },
      { path: '/frontend/color-selector', label: 'menu.colorSelector' }
    ]
  },
  {
    key: 'convert',
    title: 'menu.convert',
    icon: Switch,
    link: '/convert/case-convert',
    prefix: '/convert',
    hidden: true,
    items: [
      { path: '/convert/case-convert', label: 'menu.caseConvert' },
      { path: '/convert/full-half-convert', label: 'menu.fullHalfConvert' },
      { path: '/convert/lang-convert', label: 'menu.langConvert' }
    ]
  },
  {
    key: 'qrcode',
    title: 'menu.qrcode',
    icon: MagicStick,
    link: '/qrcode/qrcode-gen',
    prefix: '/qrcode',
    hidden: true,
    items: [
      { path: '/qrcode/qrcode-gen', label: 'menu.qrcodeGen' },
      { path: '/qrcode/qrcode-beautify', label: 'menu.qrcodeBeautify' },
      { path: '/qrcode/qrcode-parse', label: 'menu.qrcodeParse' }
    ]
  },
  {
    key: 'webmaster',
    title: 'menu.webmaster',
    icon: Guide,
    link: '/webmaster/linux-cmd',
    prefix: '/webmaster',
    hidden: true,
    items: [
      { path: '/webmaster/linux-cmd', label: 'menu.linuxCmd' },
      { path: '/webmaster/seo-tool', label: 'menu.seoTool' },
      { path: '/webmaster/js-lib', label: 'menu.jsLib' }
    ]
  },
  {
    key: 'lifeTool',
    title: 'menu.lifeTool',
    icon: CoffeeCup,
    link: '/life/date-calc',
    prefix: '/life',
    hidden: true,
    items: [
      { path: '/life/date-calc', label: 'menu.dateCalc' },
      { path: '/life/stopwatch', label: 'menu.stopwatch' },
      { path: '/life/festival', label: 'menu.festival' },
      { path: '/life/postal-code', label: 'menu.postalCode' },
      { path: '/life/mix-rate', label: 'menu.mixRate' }
    ]
  },
  {
    key: 'culture',
    title: 'menu.culture',
    icon: Trophy,
    link: '/culture/periodic-table',
    prefix: '/culture',
    hidden: true,
    items: [
      { path: '/culture/periodic-table', label: 'menu.periodicTable' },
      { path: '/culture/sentence-trans', label: 'menu.sentenceTrans' }
    ]
  },
  {
    key: 'otherTools',
    title: 'menu.otherTools',
    icon: MoreFilled,
    link: '/other/algebra',
    prefix: '/other',
    hidden: true,
    items: [
      { path: '/other/algebra', label: 'menu.algebra' },
      { path: '/other/image-tool', label: 'menu.imageTool' },
      { path: '/other/sudoku', label: 'menu.sudoku' },
      { path: '/other/about', label: 'menu.about' },
      { path: '/other/privacy', label: 'menu.privacy' },
      { path: '/other/contact', label: 'menu.contact' },
      { path: '/other/feedback', label: 'menu.feedback' }
    ]
  }
]

const activeMenu = computed(() => {
  if (route.path === '/' || route.path === '/json') {
    return isMobile.value ? '/json' : 'json'
  }
  if (route.path.startsWith('/json')) return route.path
  return route.path
})

// H5：一级菜单高亮（当前路由命中该分组时，仅变色不背景）
const isGroupActive = (group) => {
  if (!isMobile.value) return false
  if (group.exact && group.exact.includes(route.path)) return true
  return route.path.startsWith(group.prefix)
}

const goGroup = (group) => {
  router.push(group.link)
  if (isMobile.value) {
    isMobileMenuOpen.value = false
  }
}

const handleLanguageChange = (lang) => {
  locale.value = lang
  appStore.setLanguage(lang)
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// H5：点一级菜单右侧图标，只展开/收起二级菜单，不跳转
const toggleMobileSubMenu = (key) => {
  mobileSubOpenMap.value = {
    ...mobileSubOpenMap.value,
    [key]: !mobileSubOpenMap.value[key]
  }
}

// 菜单收起时，同时收起所有二级菜单，保证下次打开默认是折叠状态
watch(isMobileMenuOpen, (v) => {
  if (!v) mobileSubOpenMap.value = {}
})

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
  flex-shrink: 0;
}

// 被屏蔽的菜单：保留在结构中但不展示
.is-hidden {
  display: none !important;
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

.menu-title {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 100%;
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
    padding: 10px 15px;
    transform: translateY(-100%);
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
    z-index: 999;
    max-height: 40vh;
    overflow-y: auto;
    // 提前预留滚动条宽度，避免展开二级菜单出现滚动条时内容被顶得错位
    scrollbar-gutter: stable;
    max-width: 100%;
    flex-wrap: wrap;
    justify-content: flex-start;

    &.is-active {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    .nav-menu {
      display: block;
      width: 100%;
      flex-wrap: wrap;
      white-space: normal;
      border-right: none;
    }

    .mobile-menu-group {
      width: 100%;
    }

    .mobile-menu-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      cursor: pointer;
      user-select: none;

      &.is-active {
        // 与二级菜单选中态保持一致：仅文字与左侧图标变蓝，无背景
        color: #409eff;
      }

      .mobile-menu-label {
        flex: 1;
        display: flex;
        align-items: center;
        height: 100%;
        padding-left: 20px;

        :deep(.el-icon) {
          margin-right: 6px;
        }
      }

      .mobile-menu-toggle {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 0 16px;
        color: #909399;
        cursor: pointer;

        // 防止 el-icon 内的箭头 SVG 在窄容器里被 flex 压缩成 0 宽（不可见）
        :deep(svg) {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        &:hover {
          color: #409eff;
        }
      }
    }

    .mobile-sub-item {
      // 对齐一级菜单文字的第 2 个字符位置（一级文字起点约 50px + 1 个字符宽）
      padding-left: 58px !important;
    }
  }

  // 菜单展开时的遮罩，覆盖除菜单外的页面区域
  .menu-mask {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 998; // 低于菜单 999，高于页面内容
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;

    &.is-active {
      opacity: 1;
      pointer-events: auto;
    }
  }

  .navbar-right {
    .mobile-menu-button {
      display: flex;
    }

    .lang-selector {
      width: 110px;
    }
  }
}
</style>
