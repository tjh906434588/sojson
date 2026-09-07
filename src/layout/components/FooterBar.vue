<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <p class="copyright">{{ $t('footer.copyright') }}</p>
        <p class="disclaimer">{{ $t('footer.disclaimer') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.footer {
  background: #2c3e50;
  color: white;
  padding: 20px 0;
  margin-top: auto;
  flex-shrink: 0;
}

.footer-container {
  max-width: var(--layout-max-width);
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  text-align: center;
  
  .copyright {
    font-size: var(--font-size-base);
    margin-bottom: 5px;
  }
  
  .disclaimer {
    font-size: var(--font-size-sm);
    color: #95a5a6;
  }
}
</style>
