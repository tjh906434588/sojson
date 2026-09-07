<template>
  <ToolCardGrid :tools="tools" />
</template>

<script setup lang="ts">
import ToolCardGrid from '@/components/ToolCardGrid.vue'
import { encryptToolCards } from '@/router/modules/encrypt'

// 加解密工具：一级菜单 encrypt 的落地页入口卡片（从 encrypt 路由模块引入）
const tools = encryptToolCards
</script>
