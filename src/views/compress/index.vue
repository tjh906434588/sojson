<template>
  <ToolCardGrid :tools="tools" />
</template>

<script setup lang="ts">
import ToolCardGrid from '@/components/ToolCardGrid/index.vue'
import { compressToolCards } from '@/router/modules/compress'

// 压缩格式化工具：一级菜单 compress 的落地页入口卡片（从 compress 路由模块引入）
const tools = compressToolCards
</script>
