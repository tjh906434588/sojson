<template>
  <header class="navbar">
    <div class="navbar-container">
      <div class="navbar-left">
        <router-link :to="firstMenuLink" class="logo">
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
                  <!-- 扁平二级菜单 -->
                  <el-menu-item
                    v-for="item in group.items"
                    :key="item.path"
                    :index="item.path"
                    class="mobile-sub-item"
                  >{{ $t(item.label) }}</el-menu-item>
                  <!-- 分组二级菜单（模块） -->
                  <template v-for="module in group.modules" :key="module.key">
                    <div class="mobile-module">
                      <div class="mobile-module-top">
                        <span class="mobile-module-label">{{ $t(module.title) }}</span>
                      </div>
                      <el-menu-item
                        v-for="item in module.items"
                        :key="item.path"
                        :index="item.path"
                        class="mobile-sub-item"
                      >{{ $t(item.label) }}</el-menu-item>
                    </div>
                  </template>
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
              <!-- 扁平二级菜单 -->
              <template v-if="group.items">
                <el-menu-item
                  v-for="item in group.items"
                  :key="item.path"
                  :index="item.path"
                >{{ $t(item.label) }}</el-menu-item>
              </template>
              <!-- 分组二级菜单（模块） -->
              <template v-else-if="group.modules">
                <template v-for="module in group.modules" :key="module.key">
                  <div class="web-module-title">
                    <span class="web-module-title-label">{{ $t(module.title) }}</span>
                  </div>
                  <el-menu-item
                    v-for="item in module.items"
                    :key="item.path"
                    :index="item.path"
                  >{{ $t(item.label) }}</el-menu-item>
                </template>
              </template>
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

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/app'
import { jsonMenu } from '@/router/modules/json'
import { encryptMenu } from '@/router/modules/encrypt'
import { compressMenu } from '@/router/modules/compress'
import { documentMenu } from '@/router/modules/document'
import { frontendMenu } from '@/router/modules/frontend'
import { convertMenu } from '@/router/modules/convert'
import { otherMenu } from '@/router/modules/other'
import { ArrowDown, ArrowUp, Menu, Tools } from '@element-plus/icons-vue'
import type { NavMenuGroup } from '@/types'
import { useIsMobile } from '@/utils'

const router = useRouter()
const route = useRoute()
const { locale } = useI18n()
const appStore = useAppStore()

const selectedLang = ref(locale.value)
const isMobileMenuOpen = ref(false)
// H5：各一级菜单的二级展开状态（key: boolean）
const mobileSubOpenMap = ref({})
const isMobile = useIsMobile()

// 一级菜单数据由各菜单路由模块（@/router/<菜单>）提供，业务侧不再自行维护菜单列表
// hidden: true 表示“屏蔽”——保留但隐藏，不参与展示
const menus: NavMenuGroup[] = [
  jsonMenu,
  encryptMenu,
  compressMenu,
  documentMenu,
  frontendMenu,
  convertMenu,
  otherMenu
]

// 项目无独立首页，logo 点击直接导航到第一个一级菜单（当前为 JSON 工具）
const firstMenuLink = menus[0].link

const activeMenu = computed(() => {
  // 组首页（如 /json、/encrypt、/compress、/document、/frontend）高亮对应一级菜单
  const groupHomePaths = menus.map((m) => m.link)
  if (groupHomePaths.includes(route.path)) {
    const key = route.path.split('/')[1]
    return isMobile.value ? '/' + key : key
  }
  return route.path
})

// H5：一级菜单高亮（当前路由命中该分组时，仅变色不背景）
const isGroupActive = (group: NavMenuGroup) => {
  if (!isMobile.value) return false
  if (group.exact && group.exact.includes(route.path)) return true
  return route.path.startsWith(group.prefix || '')
}

const goGroup = (group: NavMenuGroup) => {
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
  if (!v) {
    mobileSubOpenMap.value = {}
  }
})

const handleMenuSelect = (index) => {
  router.push(index)
  if (isMobile.value) {
    isMobileMenuOpen.value = false
  }
}

// 桌面端自动收起移动端菜单
watch(isMobile, (v) => {
  if (!v) isMobileMenuOpen.value = false
}, { immediate: true })
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
  height: var(--navbar-height);
  max-width: var(--layout-max-width);
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
    color: var(--color-primary);

    .logo-text {
      margin-left: 8px;
      font-size: var(--font-size-xl);
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
    }
  }
}

.navbar-menu {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center; // 菜单在导航栏内垂直居中
  justify-content: flex-start;
  overflow-x: auto;
  overflow-y: hidden;
  max-width: calc(100% - 280px);
  // 隐藏横向滚动条且不占位：避免滚动条挤压内容区导致菜单顶部被裁、出现“靠上”错位
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
    height: 0;
  }

  .nav-menu {
    border-bottom: none;
    display: flex;
    flex-wrap: nowrap;
    white-space: nowrap;
    height: 100%; // 撑满导航栏高度，与 logo 一样垂直居中

    :deep(.el-sub-menu__title) {
      height: 100%; // 一级菜单项撑满菜单条，icon 与文字在内部垂直居中
    }
  }
}

// Web：一级菜单项压缩内边距，避免菜单过多时出现横向滚动条
// 子菜单标题右侧需预留箭头空间（EP 箭头 right: 20px、宽约 12px），
// 否则压缩后箭头会与标题文字重叠；普通菜单项无箭头，可正常压缩
@media (min-width: 769px) {
  .nav-menu {
    :deep(.el-sub-menu__title) {
      padding: 0 36px 0 12px !important;
    }

    :deep(.el-menu-item) {
      padding: 0 12px !important;
    }
  }

  .menu-title {
    gap: 4px;
  }
}

.menu-title {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 100%;
}

// Web：模块名作为分组标题，前后横线拉通占满剩余空间，下方紧跟该模块的二级菜单项
.web-module-title {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px 4px;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  cursor: default;
  white-space: nowrap;

  &::before,
  &::after {
    content: '';
    flex: 1 1 0;
    min-width: 16px;
    height: 1px;
    background: var(--border-color-lighter);
  }

  .web-module-title-label {
    flex-shrink: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
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
    min-height: var(--navbar-height);
  }

  .navbar-container {
    height: auto;
    min-height: var(--navbar-height);
    padding: 0 15px;
    flex-wrap: wrap;
  }

  .navbar-menu {
    position: fixed;
    top: var(--navbar-height);
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
        color: var(--color-primary);
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
        color: var(--text-secondary);
        cursor: pointer;

        // 防止 el-icon 内的箭头 SVG 在窄容器里被 flex 压缩成 0 宽（不可见）
        :deep(svg) {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        &:hover {
          color: var(--color-primary);
        }
      }
    }

    .mobile-sub-item {
      // 对齐一级菜单文字的第 2 个字符位置（一级文字起点约 50px + 1 个字符宽）
      padding-left: 58px !important;
    }

    .mobile-module {
      width: 100%;
    }

    .mobile-module-top {
      display: flex;
      align-items: center;
      gap: 10px;
      height: 44px;
      padding: 0 30px;
      color: var(--text-regular);
      font-size: var(--font-size-md);

      // 标题前后横线拉通，占满剩余空间
      &::before,
      &::after {
        content: '';
        flex: 1 1 0;
        min-width: 20px;
        height: 1px;
        background: var(--border-color-lighter);
      }

      .mobile-module-label {
        flex-shrink: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .mobile-module .mobile-sub-item {
      padding-left: 42px !important;
    }
  }

  // 菜单展开时的遮罩，覆盖除菜单外的页面区域
  .menu-mask {
    position: fixed;
    top: var(--navbar-height);
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