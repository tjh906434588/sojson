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
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { colorGroups } from '@/config/webColorsData'

const { t } = useI18n()

// 点击色块复制 HEX 值，方便直接使用
const copyColor = (hex) => {
  navigator.clipboard.writeText(hex).then(() => {
    ElMessage.success(`${hex} ${t('common.copied')}`)
  }).catch(() => {})
}
</script>

<style scoped lang="scss">
// 参考 JSON 解析页面：卡片占满内容区，无 el-card__header
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 20px; // 覆盖全局 .container 的 padding，仅保留左右边距
}

.tool-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 0; // 覆盖全局 .tool-card 的 padding: 24px
  margin-bottom: 0; // 覆盖全局 .tool-card 的 margin-bottom: 20px

  // el-card 内容实际在 body 内，让 body 撑满卡片高度
  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 20px; // 卡片内容内边距
  }
}

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
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 20px;
  padding-left: 12px;
  border-left: 4px solid #409eff;
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
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.category-desc {
  font-size: 13px;
  color: #909399;
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
    font-size: 12px;
    font-family: monospace;
  }
}
</style>
