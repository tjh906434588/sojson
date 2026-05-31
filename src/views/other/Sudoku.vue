<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.sudoku.title') }}</h1>
          <p class="tool-description">{{ $t('tools.sudoku.description') }}</p>
        </div>
      </template>
      
      <div class="sudoku-container">
        <div class="button-group">
          <el-button type="primary" @click="newGame">{{ $t('tools.sudoku.newGame') }}</el-button>
          <el-button @click="checkSolution">{{ $t('tools.sudoku.check') }}</el-button>
          <el-button @click="solveSudoku">{{ $t('tools.sudoku.solve') }}</el-button>
          <el-button type="danger" @click="clearBoard">{{ $t('tools.sudoku.clear') }}</el-button>
        </div>
        
        <div class="sudoku-board">
          <div v-for="(row, rowIndex) in board" :key="rowIndex" class="sudoku-row">
            <div 
              v-for="(cell, colIndex) in row" 
              :key="colIndex"
              class="sudoku-cell"
              :class="{
                'fixed': initialBoard[rowIndex][colIndex] !== 0,
                'selected': selectedCell?.row === rowIndex && selectedCell?.col === colIndex,
                'same-row': selectedCell?.row === rowIndex,
                'same-col': selectedCell?.col === colIndex,
                'same-block': Math.floor(selectedCell?.row / 3) === Math.floor(rowIndex / 3) && Math.floor(selectedCell?.col / 3) === Math.floor(colIndex / 3),
                'error': cell !== 0 && !isValidPlacement(rowIndex, colIndex, cell)
              }"
              @click="selectCell(rowIndex, colIndex)"
            >
              {{ cell || '' }}
            </div>
          </div>
        </div>
        
        <div class="button-group number-pad">
          <el-button 
            v-for="n in 9" 
            :key="n" 
            @click="fillNumber(n)"
            :disabled="selectedCell?.fixed"
          >
            {{ n }}
          </el-button>
          <el-button @click="fillNumber(0)">{{ $t('common.clear') }}</el-button>
        </div>
        
        <el-alert
          v-if="message"
          :title="message"
          :type="messageType"
          :closable="false"
          style="margin-top: 20px"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const board = reactive(Array(9).fill().map(() => Array(9).fill(0)))
const initialBoard = reactive(Array(9).fill().map(() => Array(9).fill(0)))
const selectedCell = ref(null)
const message = ref('')
const messageType = ref('success')

const selectCell = (row, col) => {
  if (initialBoard[row][col] === 0) {
    selectedCell.value = { row, col, fixed: false }
  } else {
    selectedCell.value = { row, col, fixed: true }
  }
}

const fillNumber = (num) => {
  if (!selectedCell.value || selectedCell.value.fixed) return
  board[selectedCell.value.row][selectedCell.value.col] = num
  message.value = ''
}

const isValidPlacement = (row, col, num) => {
  if (num === 0) return true
  
  for (let i = 0; i < 9; i++) {
    if (i !== col && board[row][i] === num) return false
    if (i !== row && board[i][col] === num) return false
  }
  
  const blockRow = Math.floor(row / 3) * 3
  const blockCol = Math.floor(col / 3) * 3
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const r = blockRow + i
      const c = blockCol + j
      if ((r !== row || c !== col) && board[r][c] === num) return false
    }
  }
  
  return true
}

const newGame = () => {
  const puzzle = generatePuzzle()
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      board[i][j] = puzzle[i][j]
      initialBoard[i][j] = puzzle[i][j]
    }
  }
  message.value = ''
  selectedCell.value = null
}

const generatePuzzle = () => {
  const base = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ]
  return base
}

const checkSolution = () => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (!isValidPlacement(i, j, board[i][j])) {
        message.value = t('tools.sudoku.solutionError')
        messageType.value = 'error'
        return
      }
    }
  }
  message.value = t('tools.sudoku.congratulations')
  messageType.value = 'success'
}

const solveSudoku = () => {
  const solved = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ]
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      board[i][j] = solved[i][j]
    }
  }
  
  message.value = t('tools.sudoku.sudokuSolved')
  messageType.value = 'success'
}

const clearBoard = () => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (initialBoard[i][j] === 0) {
        board[i][j] = 0
      }
    }
  }
  message.value = ''
}

newGame()
</script>

<style scoped lang="scss">
.sudoku-container {
  max-width: 500px;
  margin: 0 auto;
}

.sudoku-board {
  display: flex;
  flex-direction: column;
  border: 3px solid #409eff;
  width: fit-content;
  margin: 20px auto;
}

.sudoku-row {
  display: flex;
}

.sudoku-cell {
  width: 50px;
  height: 50px;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  background: white;
  
  &:nth-child(3), &:nth-child(6) {
    border-right: 2px solid #409eff;
  }
  
  &.fixed {
    background: #f0f0f0;
    cursor: not-allowed;
  }
  
  &.selected {
    background: #409eff;
    color: white;
  }
  
  &.same-row, &.same-col {
    background: #e6f7ff;
  }
  
  &.same-block {
    background: #d9ecff;
  }
  
  &.error {
    color: #f56c6c;
  }
}

.sudoku-row:nth-child(3), .sudoku-row:nth-child(6) {
  border-bottom: 2px solid #409eff;
}

.number-pad {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .sudoku-cell {
    width: 38px;
    height: 38px;
    font-size: 18px;
  }
}
</style>
