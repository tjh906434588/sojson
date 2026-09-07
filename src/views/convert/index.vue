<template>
  <ToolCardGrid :tools="tools" />
</template>

<script setup lang="ts">
import ToolCardGrid from '@/components/ToolCardGrid/index.vue'
import { convertToolCards } from '@/router/modules/convert'

// 转换工具：一级菜单 convert 的落地页入口卡片（从 convert 路由模块引入）
const tools = convertToolCards
</script>
