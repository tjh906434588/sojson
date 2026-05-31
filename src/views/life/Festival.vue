<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.festival.title') }}</h1>
          <p class="tool-description">{{ $t('tools.festival.description') }}</p>
        </div>
      </template>
      
      <el-table :data="festivals" stripe style="width: 100%">
        <el-table-column prop="name" :label="$t('tools.festival.name')" width="200" />
        <el-table-column prop="date" :label="$t('tools.festival.date')" />
        <el-table-column prop="country" :label="$t('tools.festival.country')" width="150" />
        <el-table-column prop="type" :label="$t('tools.festival.type')" width="120" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const festivals = ref([
  { name: "New Year's Day", date: 'January 1', country: 'Global', type: 'Holiday' },
  { name: "Valentine's Day", date: 'February 14', country: 'Global', type: 'Holiday' },
  { name: "Women's Day", date: 'March 8', country: 'Global', type: 'Holiday' },
  { name: "April Fools' Day", date: 'April 1', country: 'Global', type: 'Holiday' },
  { name: "Earth Day", date: 'April 22', country: 'Global', type: 'Holiday' },
  { name: "Labor Day", date: 'May 1', country: 'Global', type: 'Holiday' },
  { name: "Children's Day", date: 'June 1', country: 'Global', type: 'Holiday' },
  { name: "National Day", date: 'October 1', country: 'China', type: 'Holiday' },
  { name: "Christmas", date: 'December 25', country: 'Global', type: 'Holiday' },
  { name: "New Year's Eve", date: 'December 31', country: 'Global', type: 'Holiday' },
  { name: "Spring Festival", date: 'Lunar New Year', country: 'China', type: 'Holiday' },
  { name: "Mid-Autumn Festival", date: '15th of 8th lunar month', country: 'China', type: 'Holiday' },
  { name: "Dragon Boat Festival", date: '5th of 5th lunar month', country: 'China', type: 'Holiday' },
  { name: "Qingming Festival", date: 'April 4-6', country: 'China', type: 'Holiday' },
  { name: "Thanksgiving", date: '4th Thursday of November', country: 'USA', type: 'Holiday' },
  { name: "Independence Day", date: 'July 4', country: 'USA', type: 'Holiday' },
  { name: "Bastille Day", date: 'July 14', country: 'France', type: 'Holiday' },
  { name: "Boxing Day", date: 'December 26', country: 'UK', type: 'Holiday' }
])
</script>
