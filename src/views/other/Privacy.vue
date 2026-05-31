<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.privacy.title') }}</h1>
          <p class="tool-description">{{ $t('tools.privacy.description') }}</p>
        </div>
      </template>
      
      <div class="privacy-content">
        <section>
          <h2>Information We Collect</h2>
          <p>
            Our online tools are designed with privacy in mind. We do not collect, store, or 
            share any personal information. All processing happens locally in your browser.
          </p>
        </section>
        
        <section>
          <h2>Local Processing</h2>
          <p>
            All tools provided on this website process data locally on your device. This means:
          </p>
          <ul>
            <li>Your data never leaves your browser</li>
            <li>No data is sent to external servers</li>
            <li>Your files and text remain on your device</li>
            <li>Complete privacy and data security</li>
          </ul>
        </section>
        
        <section>
          <h2>Cookies</h2>
          <p>
            We use minimal cookies only for essential functionality such as language preferences. 
            These cookies do not track your browsing activity or collect personal information.
          </p>
        </section>
        
        <section>
          <h2>Third-Party Services</h2>
          <p>
            Some tools may use third-party libraries for enhanced functionality. These libraries 
            are loaded from trusted CDN sources and are subject to their respective privacy policies.
          </p>
        </section>
        
        <section>
          <h2>Data Security</h2>
          <p>
            We take security seriously. All data processing happens locally in your browser using 
            modern cryptographic standards. We continuously update our security measures to 
            protect your data.
          </p>
        </section>
        
        <section>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Any changes will be posted on 
            this page with an updated revision date.
          </p>
        </section>
        
        <section>
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us through our 
            feedback form or contact page.
          </p>
        </section>
        
        <p class="last-updated">
          Last updated: 2024
        </p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
</script>

<style scoped lang="scss">
.privacy-content {
  max-width: 800px;
  margin: 0 auto;
  
  section {
    margin-bottom: 30px;
    
    h2 {
      color: #409eff;
      margin-bottom: 15px;
      font-size: 20px;
    }
    
    p {
      color: #606266;
      line-height: 1.8;
    }
    
    ul {
      padding-left: 30px;
      color: #606266;
      
      li {
        margin-bottom: 8px;
        line-height: 1.6;
      }
    }
  }
  
  .last-updated {
    margin-top: 40px;
    color: #909399;
    font-style: italic;
  }
}
</style>
