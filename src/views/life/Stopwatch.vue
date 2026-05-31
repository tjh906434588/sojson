<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.stopwatch.title') }}</h1>
          <p class="tool-description">{{ $t('tools.stopwatch.description') }}</p>
        </div>
      </template>
      
      <div class="stopwatch-container">
        <div class="time-display">{{ formattedTime }}</div>
        
        <div class="lap-times" v-if="lapTimes.length">
          <h3>Lap Times</h3>
          <el-table :data="lapTimes" stripe size="small">
            <el-table-column prop="lap" label="Lap" width="80" />
            <el-table-column prop="time" label="Time" />
            <el-table-column prop="split" label="Split" />
          </el-table>
        </div>
        
        <div class="controls">
          <el-button 
            :type="isRunning ? 'warning' : 'success'" 
            @click="toggleStopwatch"
          >
            {{ isRunning ? 'Pause' : 'Start' }}
          </el-button>
          <el-button type="info" @click="lap" :disabled="!isRunning">Lap</el-button>
          <el-button type="danger" @click="reset">Reset</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const isRunning = ref(false)
const elapsedTime = ref(0)
const startTime = ref(0)
const lapTimes = ref([])
let timerInterval = null

const formattedTime = computed(() => {
  const ms = elapsedTime.value % 1000
  const seconds = Math.floor(elapsedTime.value / 1000) % 60
  const minutes = Math.floor(elapsedTime.value / 60000) % 60
  const hours = Math.floor(elapsedTime.value / 3600000)
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`
})

const toggleStopwatch = () => {
  if (isRunning.value) {
    clearInterval(timerInterval)
    isRunning.value = false
  } else {
    startTime.value = Date.now() - elapsedTime.value
    timerInterval = setInterval(() => {
      elapsedTime.value = Date.now() - startTime.value
    }, 10)
    isRunning.value = true
  }
}

const lap = () => {
  if (!isRunning.value) return
  
  const lastLapTime = lapTimes.value.length > 0 
    ? lapTimes.value[lapTimes.value.length - 1].timeMs 
    : 0
  
  lapTimes.value.push({
    lap: lapTimes.value.length + 1,
    time: formattedTime.value,
    split: formatTime(elapsedTime.value - lastLapTime),
    timeMs: elapsedTime.value
  })
}

const formatTime = (ms) => {
  const msPart = ms % 1000
  const seconds = Math.floor(ms / 1000) % 60
  const minutes = Math.floor(ms / 60000) % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${msPart.toString().padStart(3, '0')}`
}

const reset = () => {
  clearInterval(timerInterval)
  isRunning.value = false
  elapsedTime.value = 0
  lapTimes.value = []
  startTime.value = 0
}
</script>

<style scoped lang="scss">
.stopwatch-container {
  text-align: center;
}

.time-display {
  font-size: 64px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #409eff;
  margin: 40px 0;
  letter-spacing: 4px;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

.lap-times {
  margin-top: 30px;
  text-align: left;
  
  h3 {
    text-align: left;
    margin-bottom: 10px;
  }
}

@media (max-width: 768px) {
  .time-display {
    font-size: 36px;
  }
}
</style>
