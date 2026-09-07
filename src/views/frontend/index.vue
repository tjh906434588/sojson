<template>
  <ToolCardGrid :tools="tools" />
</template>

<script setup lang="ts">
import ToolCardGrid from '@/components/ToolCardGrid.vue'
import { frontendToolCards } from '@/router/modules/frontend'

// 前端工具：一级菜单 frontend 的落地页入口卡片（从 frontend 路由模块引入）
const tools = frontendToolCards
</script>
