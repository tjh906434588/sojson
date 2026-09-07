<!--
 * 默认布局（DefaultLayout）
 * 顶部导航工具箱（无侧边栏），布局 = NavBar + 内容区(router-view) + FooterBar
 * 由 src/router/index.ts 的根路由嵌套挂载
-->
<script setup lang="ts" name="DefaultLayout">
import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'
</script>

<template>
  <div class="app-wrapper">
    <NavBar />
    <main class="main-container">
      <router-view />
    </main>
    <FooterBar />
  </div>
</template>

<style lang="scss">
@import './style/index.scss';
</style>
