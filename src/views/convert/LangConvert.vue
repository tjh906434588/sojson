<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.langConvert.title') }}</h1>
          <p class="tool-description">{{ $t('tools.langConvert.description') }}</p>
        </div>
      </template>
      
      <el-form :model="form" label-width="120px">
        <el-form-item :label="$t('tools.langConvert.conversionType')">
          <el-select v-model="form.type">
            <el-option :label="$t('tools.langConvert.simplifiedToTraditional')" value="s2t" />
            <el-option :label="$t('tools.langConvert.traditionalToSimplified')" value="t2s" />
            <el-option :label="$t('tools.langConvert.englishTo1337')" value="en2l33t" />
            <el-option :label="$t('tools.langConvert.1337ToEnglish')" value="l2en" />
            <el-option :label="$t('tools.langConvert.zalgoText')" value="zalgo" />
            <el-option :label="$t('tools.langConvert.mirrorText')" value="mirror" />
          </el-select>
        </el-form-item>
        
        <el-form-item :label="$t('tools.langConvert.input')">
          <el-input v-model="form.input" type="textarea" :rows="4" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="convert">{{ $t('tools.langConvert.convert') }}</el-button>
          <el-button @click="copy">{{ $t('tools.langConvert.copy') }}</el-button>
          <el-button @click="clear">{{ $t('tools.langConvert.clear') }}</el-button>
        </el-form-item>
        
        <el-form-item :label="$t('tools.langConvert.output')">
          <el-input v-model="form.output" type="textarea" :rows="4" readonly />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const form = reactive({
  type: 's2t',
  input: '',
  output: ''
})

const s2tDict = {
  '个': '個', '发': '發', '万': '萬', '与': '與', '为': '為',
  '个': '個', '临': '臨', '为': '為', '义': '義', '乌': '烏',
  '乐': '樂', '乔': '喬', '书': '書', '买': '買', '争': '爭',
  '产': '產', '亨': '亨', '亲': '親', '亵': '褻', '亸': '嚲',
  '人': '人', '儿': '兒', '入': '入', '全': '全', '八': '八',
  '公': '公', '六': '六', '共': '共', '关': '關', '兴': '興',
  '兵': '兵', '具': '具', '典': '典', '内': '內', '册': '冊',
  '冲': '沖', '冰': '冰', '决': '決', '冷': '冷', '冻': '凍',
  '净': '凈', '几': '幾', '凤': '鳳', '凫': '鳧', '凯': '凱',
  '划': '劃', '剧': '劇', '刘': '劉', '创': '創', '删': '冊',
  '别': '別', '到': '到', '制': '制', '剑': '劍', '剂': '劑'
}

const convert = () => {
  if (!form.input) {
    ElMessage.warning(t('tools.langConvert.pleaseEnterText'))
    return
  }
  
  if (form.type === 's2t') {
    form.output = form.input.split('').map(char => s2tDict[char] || char).join('')
  } else if (form.type === 't2s') {
    const t2sDict = Object.fromEntries(Object.entries(s2tDict).map(([k, v]) => [v, k]))
    form.output = form.input.split('').map(char => t2sDict[char] || char).join('')
  } else if (form.type === 'en2l33t') {
    const leet = { 'a': '4', 'e': '3', 'o': '0', 'l': '1', 't': '7', 's': '5' }
    form.output = form.input.toLowerCase().split('').map(char => leet[char] || char).join('')
  } else if (form.type === 'l2en') {
    const leet = { '4': 'a', '3': 'e', '0': 'o', '1': 'l', '7': 't', '5': 's' }
    form.output = form.input.split('').map(char => leet[char] || char).join('')
  } else if (form.type === 'zalgo') {
    const zalgoUp = ['\u030D', '\u030E', '\u0304', '\u0305', '\u033F', '\u0311', '\u0306', '\u0310', '\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030A', '\u0342', '\u0343', '\u0344', '\u034A', '\u034B', '\u034C', '\u0303', '\u0302', '\u031C', '\u030F', '\u0312', '\u0313', '\u0314', '\u033D', '\u0309', '\u0363', '\u0364', '\u0365', '\u0366', '\u0367', '\u0368', '\u0369', '\u036A', '\u036B', '\u036C', '\u036D', '\u036E', '\u036F', '\u033E', '\u035B', '\u0346', '\u031A']
    form.output = form.input.split('').map(char => {
      let result = char
      for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
        result += zalgoUp[Math.floor(Math.random() * zalgoUp.length)]
      }
      return result
    }).join('')
  } else if (form.type === 'mirror') {
    const mirror = 'ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz'
    form.output = form.input.split('').reverse().map(char => {
      const index = char.toLowerCase().charCodeAt(0) - 97
      return index >= 0 && index < 26 ? mirror[index] : char
    }).join('')
  }
}

const copy = () => {
  if (form.output) {
    navigator.clipboard.writeText(form.output)
    ElMessage.success(t('tools.langConvert.copied'))
  }
}

const clear = () => {
  form.input = ''
  form.output = ''
}
</script>
