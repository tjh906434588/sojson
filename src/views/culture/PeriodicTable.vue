<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.periodicTable.title') }}</h1>
          <p class="tool-description">{{ $t('tools.periodicTable.description') }}</p>
        </div>
      </template>
      
      <div class="periodic-table">
        <div 
          v-for="element in elements" 
          :key="element.number"
          class="element"
          :class="'category-' + element.category"
          :title="element.name"
          @click="showDetail(element)"
        >
          <span class="number">{{ element.number }}</span>
          <span class="symbol">{{ element.symbol }}</span>
          <span class="name">{{ element.name }}</span>
        </div>
      </div>
      
      <el-dialog v-model="dialogVisible" :title="selectedElement?.name" width="400px">
        <el-descriptions :column="1" border v-if="selectedElement">
          <el-descriptions-item label="Symbol">{{ selectedElement.symbol }}</el-descriptions-item>
          <el-descriptions-item label="Atomic Number">{{ selectedElement.number }}</el-descriptions-item>
          <el-descriptions-item label="Atomic Mass">{{ selectedElement.mass }}</el-descriptions-item>
          <el-descriptions-item label="Category">{{ selectedElement.category }}</el-descriptions-item>
          <el-descriptions-item label="Configuration">{{ selectedElement.config }}</el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dialogVisible = ref(false)
const selectedElement = ref(null)

const elements = ref([
  { number: 1, symbol: 'H', name: 'Hydrogen', mass: '1.008', category: 'nonmetal', config: '1s1' },
  { number: 2, symbol: 'He', name: 'Helium', mass: '4.003', category: 'noble', config: '1s2' },
  { number: 3, symbol: 'Li', name: 'Lithium', mass: '6.941', category: 'alkali', config: '[He] 2s1' },
  { number: 4, symbol: 'Be', name: 'Beryllium', mass: '9.012', category: 'alkaline', config: '[He] 2s2' },
  { number: 5, symbol: 'B', name: 'Boron', mass: '10.81', category: 'metalloid', config: '[He] 2s2 2p1' },
  { number: 6, symbol: 'C', name: 'Carbon', mass: '12.01', category: 'nonmetal', config: '[He] 2s2 2p2' },
  { number: 7, symbol: 'N', name: 'Nitrogen', mass: '14.01', category: 'nonmetal', config: '[He] 2s2 2p3' },
  { number: 8, symbol: 'O', name: 'Oxygen', mass: '16.00', category: 'nonmetal', config: '[He] 2s2 2p4' },
  { number: 9, symbol: 'F', name: 'Fluorine', mass: '19.00', category: 'halogen', config: '[He] 2s2 2p5' },
  { number: 10, symbol: 'Ne', name: 'Neon', mass: '20.18', category: 'noble', config: '[He] 2s2 2p6' },
  { number: 11, symbol: 'Na', name: 'Sodium', mass: '22.99', category: 'alkali', config: '[Ne] 3s1' },
  { number: 12, symbol: 'Mg', name: 'Magnesium', mass: '24.31', category: 'alkaline', config: '[Ne] 3s2' },
  { number: 13, symbol: 'Al', name: 'Aluminum', mass: '26.98', category: 'metal', config: '[Ne] 3s2 3p1' },
  { number: 14, symbol: 'Si', name: 'Silicon', mass: '28.09', category: 'metalloid', config: '[Ne] 3s2 3p2' },
  { number: 15, symbol: 'P', name: 'Phosphorus', mass: '30.97', category: 'nonmetal', config: '[Ne] 3s2 3p3' },
  { number: 16, symbol: 'S', name: 'Sulfur', mass: '32.07', category: 'nonmetal', config: '[Ne] 3s2 3p4' },
  { number: 17, symbol: 'Cl', name: 'Chlorine', mass: '35.45', category: 'halogen', config: '[Ne] 3s2 3p5' },
  { number: 18, symbol: 'Ar', name: 'Argon', mass: '39.95', category: 'noble', config: '[Ne] 3s2 3p6' },
  { number: 19, symbol: 'K', name: 'Potassium', mass: '39.10', category: 'alkali', config: '[Ar] 4s1' },
  { number: 20, symbol: 'Ca', name: 'Calcium', mass: '40.08', category: 'alkaline', config: '[Ar] 4s2' }
])

const showDetail = (element) => {
  selectedElement.value = element
  dialogVisible.value = true
}
</script>

<style scoped lang="scss">
.periodic-table {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 5px;
}

.element {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
  font-size: 12px;
  padding: 4px;
  
  &:hover {
    transform: scale(1.1);
  }
  
  .number {
    font-size: 10px;
  }
  
  .symbol {
    font-size: 18px;
    font-weight: bold;
  }
  
  .name {
    font-size: 8px;
    text-align: center;
  }
}

.category-nonmetal { background: #90EE90; }
.category-noble { background: #DDA0DD; }
.category-alkali { background: #FFB6C1; }
.category-alkaline { background: #98FB98; }
.category-metalloid { background: #FFE4B5; }
.category-halogen { background: #87CEEB; }
.category-metal { background: #B0C4DE; }
</style>
