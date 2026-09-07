<template>
  <div class="container">
    <el-card class="tool-card">
      <!-- 与 JSON 解析页面一致：无 el-card__header、无标题栏，直接展示内容 -->
      <div class="color-content">
        <div v-for="group in colorGroups" :key="group.title" class="color-group">
          <h2 class="group-title">{{ group.title }}</h2>

          <div v-for="cat in group.categories" :key="cat.title" class="category">
            <div class="category-head">
              <h3 class="category-title">{{ cat.title }}</h3>
              <p v-if="cat.desc" class="category-desc">{{ cat.desc }}</p>
            </div>
            <div class="color-grid">
              <div
                v-for="hex in cat.colors"
                :key="hex"
                class="color-item"
                :style="{ backgroundColor: hex }"
                :title="hex"
                @click="copyColor(hex)"
              >
                <span class="color-label">{{ hex }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { colorGroups } from '@/config/webColorsData'
import { copyToClipboard } from '@/utils'

const { t } = useI18n()

// 点击色块复制 HEX 值，方便直接使用
const copyColor = (hex) => {
  copyToClipboard(hex, `${hex} ${t('common.copied')}`)
}
</script>

<style scoped lang="scss">
// 颜色内容区在卡片内部滚动，避免整页滚动
.color-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.color-group {
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
}

.group-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 20px;
  padding-left: 12px;
  border-left: 4px solid var(--color-primary);
  line-height: 1.4;
}

.category {
  margin-bottom: 28px;

  &:last-child {
    margin-bottom: 0;
  }
}

.category-head {
  margin-bottom: 12px;
}

.category-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.category-desc {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  margin: 4px 0 0;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.color-item {
  height: 72px;
  border-radius: 6px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
  }

  .color-label {
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    padding: 2px 8px;
    border-radius: 3px;
    font-size: var(--font-size-sm);
    font-family: monospace;
  }
}
</style>
