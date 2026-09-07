<template>
  <ToolCardGrid :tools="tools" />
</template>

<script setup lang="ts">
import ToolCardGrid from '@/components/ToolCardGrid.vue'
import { documentToolCards } from '@/router/modules/document'

// 文档工具：一级菜单 document 的落地页入口卡片（从 document 路由模块引入）
const tools = documentToolCards
</script>
