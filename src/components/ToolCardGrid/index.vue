<template>
  <div class="home">
    <div class="grid-container">
      <el-row :gutter="20" class="tool-grid">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="tool in tools" :key="tool.path">
          <router-link :to="tool.path" class="tool-link">
            <el-card class="tool-card-item" shadow="hover">
              <div class="tool-item-content">
                <el-icon :size="32" :color="tool.color">
                  <component :is="tool.icon" />
                </el-icon>
                <h3>{{ $t(tool.title) }}</h3>
                <p>{{ $t(tool.desc) }}</p>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ToolItem } from '@/types'

// 工具卡片网格：接收各一级菜单的工具列表，渲染入口卡片
defineProps<{
  tools: ToolItem[]
}>()
</script>

<style scoped lang="scss">
.home {
  padding: 0;
}

// 落地页卡片网格容器：居中 + 左右留白（工具页的撑满布局类不适用）
.grid-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  width: 100%;
}

.tool-grid {
  margin-top: 0;
  row-gap: 20px;
}

.tool-link {
  text-decoration: none;
  display: block;
  height: 100%;
}
.tool-card-item {
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  :deep(.el-card__body) {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .tool-item-content {
    text-align: center;
    padding: 20px 0;
    width: 100%;

    h3 {
      margin: 15px 0 10px;
      font-size: 18px;
      color: #303133;
    }

    p {
      color: #606266;
      font-size: 14px;
      margin: 0;
    }
  }
}

// H5：左右留白，避免卡片贴边
@media (max-width: 768px) {
  .grid-container {
    padding: 0 15px;
  }
}
</style>
