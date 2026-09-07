<template>
  <ToolCardGrid :tools="tools" />
</template>

<script setup lang="ts">
import ToolCardGrid from '@/components/ToolCardGrid/index.vue'
import { otherToolCards } from '@/router/modules/other'

// 其他工具：一级菜单 other 的落地页入口卡片（从 other 路由模块引入）
const tools = otherToolCards
</script>
