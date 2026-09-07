<template>
  <ToolCardGrid :tools="tools" />
</template>

<script setup lang="ts">
import ToolCardGrid from '@/components/ToolCardGrid.vue'
import { jsonToolCards } from '@/router/modules/json'

// JSON 工具：一级菜单 json 的落地页入口卡片（从 json 路由模块引入）
const tools = jsonToolCards
</script>
