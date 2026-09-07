<template>
  <div class="container">
    <el-card class="tool-card">
      <div class="table-wrap">
        <el-table
          :data="entities"
          stripe
          height="100%"
          class="escape-table"
        >
          <el-table-column
            class-name="col-char"
            prop="character"
            :label="$t('tools.htmlEscape.character')"
            min-width="80"
          >
            <template #default="{ row }">
              <span class="copyable" :title="$t('common.copy')" @click="copyText(row.character)">
                <el-icon class="copy-icon"><CopyDocument /></el-icon>
                {{ row.character }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            class-name="col-decimal"
            prop="decimal"
            :label="$t('tools.htmlEscape.decimal')"
            min-width="80"
          >
            <template #default="{ row }">
              <span class="copyable" :title="$t('common.copy')" @click="copyText(row.decimal)">
                <el-icon class="copy-icon"><CopyDocument /></el-icon>
                {{ row.decimal }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            class-name="col-escape"
            prop="escape"
            :label="$t('tools.htmlEscape.escape')"
            min-width="80"
          >
            <template #default="{ row }">
              <span class="copyable" :title="$t('common.copy')" @click="copyText(row.escape)">
                <el-icon class="copy-icon"><CopyDocument /></el-icon>
                {{ row.escape }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { CopyDocument } from '@element-plus/icons-vue'

const { t } = useI18n()

// 点击列内容自动复制
const copyText = (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
  } else {
    // 兼容非安全上下文（如 http 环境）的回退方案
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  ElMessage.success(t('common.copied'))
}

const entities = [
  { character: '"', decimal: '&#34;', escape: '&quot;' },
  { character: '&', decimal: '&#38;', escape: '&amp;' },
  { character: '<', decimal: '&#60;', escape: '&lt;' },
  { character: '>', decimal: '&#62;', escape: '&gt;' },
  { character: '不断开空格(non-breaking space)', decimal: '&#160;', escape: '&nbsp;' },
  { character: '?', decimal: '&#161;', escape: '&iexcl;' },
  { character: 'Á', decimal: '&#193;', escape: '&Aacute;' },
  { character: 'á', decimal: '&#225;', escape: '&aacute;' },
  { character: '￠', decimal: '&#162;', escape: '&cent;' },
  { character: 'Â', decimal: '&#194;', escape: '&circ;' },
  { character: 'â', decimal: '&#226', escape: '&acirc;' },
  { character: '￡', decimal: '&#163;', escape: '&pound;' },
  { character: 'Ã', decimal: '&#195;', escape: '&Atilde;' },
  { character: 'ã', decimal: '&#227;', escape: '&atilde;' },
  { character: '¤', decimal: '&#164;', escape: '&curren;' },
  { character: 'Ä', decimal: '&#196;', escape: '&Auml' },
  { character: 'ä', decimal: '&#228;', escape: '&auml;' },
  { character: '￥', decimal: '&#165;', escape: '&yen;' },
  { character: 'Å', decimal: '&#197;', escape: '&ring;' },
  { character: 'å', decimal: '&#229;', escape: '&aring;' },
  { character: '|', decimal: '&#166;', escape: '&brvbar;' },
  { character: 'Æ', decimal: '&#198;', escape: '&AElig;' },
  { character: 'æ', decimal: '&#230;', escape: '&aelig;' },
  { character: '§', decimal: '&#167;', escape: '&sect;' },
  { character: 'Ç', decimal: '&#199;', escape: '&Ccedil;' },
  { character: 'ç', decimal: '&#231;', escape: '&ccedil;' },
  { character: '¨', decimal: '&#168;', escape: '&uml;' },
  { character: 'È', decimal: '&#200;', escape: '&Egrave;' },
  { character: 'è', decimal: '&#232;', escape: '&egrave;' },
  { character: '©', decimal: '&#169;', escape: '&copy;' },
  { character: 'É', decimal: '&#201;', escape: '&Eacute;' },
  { character: 'é', decimal: '&#233;', escape: '&eacute;' },
  { character: 'a', decimal: '&#170;', escape: '&ordf;' },
  { character: 'Ê', decimal: '&#202;', escape: '&Ecirc;' },
  { character: 'ê', decimal: '&#234;', escape: '&ecirc;' },
  { character: '?', decimal: '&#171;', escape: '&laquo;' },
  { character: 'Ë', decimal: '&#203;', escape: '&Euml;' },
  { character: 'ë', decimal: '&#235;', escape: '&euml;' },
  { character: '?', decimal: '&#172;', escape: '&not;' },
  { character: 'Ì', decimal: '&#204;', escape: '&Igrave;' },
  { character: 'ì', decimal: '&#236;', escape: '&igrave;' },
  { character: '/x7f', decimal: '&#173;', escape: '&shy;' },
  { character: 'Í', decimal: '&#205;', escape: '&Iacute;' },
  { character: 'í', decimal: '&#237;', escape: '&iacute;' },
  { character: '®', decimal: '&#174;', escape: '&reg;' },
  { character: 'Î', decimal: '&#206;', escape: '&Icirc;' },
  { character: 'î', decimal: '&#238;', escape: '&icirc;' },
  { character: 'ˉ', decimal: '&#175;', escape: '&macr;' },
  { character: 'Ï', decimal: '&#207;', escape: '&Iuml;' },
  { character: 'ï', decimal: '&#239;', escape: '&iuml;' },
  { character: '°', decimal: '&#176;', escape: '&deg;' },
  { character: 'Ð', decimal: '&#208;', escape: '&ETH;' },
  { character: 'ð', decimal: '&#240;', escape: '&ieth;' },
  { character: '±', decimal: '&#177;', escape: '&plusmn;' },
  { character: 'Ñ', decimal: '&#209;', escape: '&Ntilde;' },
  { character: 'ñ', decimal: '&#241;', escape: '&ntilde;' },
  { character: '2', decimal: '&#178;', escape: '&sup2;' },
  { character: 'Ò', decimal: '&#210;', escape: '&Ograve;' },
  { character: 'ò', decimal: '&#242;', escape: '&ograve;' },
  { character: '3', decimal: '&#179;', escape: '&sup3;' },
  { character: 'Ó', decimal: '&#211;', escape: '&Oacute;' },
  { character: 'ó', decimal: '&#243;', escape: '&oacute;' },
  { character: '′', decimal: '&#180;', escape: '&acute;' },
  { character: 'Ô', decimal: '&#212;', escape: '&Ocirc;' },
  { character: 'ô', decimal: '&#244;', escape: '&ocirc;' },
  { character: 'μ', decimal: '&#181;', escape: '&micro;' },
  { character: 'Õ', decimal: '&#213;', escape: '&Otilde;' },
  { character: 'õ', decimal: '&#245;', escape: '&otilde;' },
  { character: '?', decimal: '&#182;', escape: '&para;' },
  { character: 'Ö', decimal: '&#214;', escape: '&Ouml;' },
  { character: 'ö', decimal: '&#246;', escape: '&ouml;' },
  { character: '·', decimal: '&#183;', escape: '&middot;' },
  { character: '&times;', decimal: '&#215;', escape: '&times;' },
  { character: '÷', decimal: '&#247;', escape: '&divide;' },
  { character: '?', decimal: '&#184;', escape: '&cedil;' },
  { character: 'Ø', decimal: '&#216;', escape: '&Oslash;' },
  { character: 'ø', decimal: '&#248;', escape: '&oslash;' },
  { character: '1', decimal: '&#185;', escape: '&sup1;' },
  { character: 'Ù', decimal: '&#217;', escape: '&Ugrave;' },
  { character: 'ù', decimal: '&#249;', escape: '&ugrave;' },
  { character: 'o', decimal: '&#186;', escape: '&ordm;' },
  { character: 'Ú', decimal: '&#218;', escape: '&Uacute;' },
  { character: 'ú', decimal: '&#250;', escape: '&uacute;' },
  { character: '?', decimal: '&#187;', escape: '&raquo;' },
  { character: 'Û', decimal: '&#219;', escape: '&Ucirc;' },
  { character: 'û', decimal: '&#251;', escape: '&ucirc;' },
  { character: '?', decimal: '&#188;', escape: '&frac14;' },
  { character: 'Ü', decimal: '&#220;', escape: '&Uuml;' },
  { character: 'ü', decimal: '&#252;', escape: '&uuml;' },
  { character: '?', decimal: '&#189;', escape: '&frac12;' },
  { character: 'Ý', decimal: '&#221;', escape: '&Yacute;' },
  { character: 'ý', decimal: '&#253;', escape: '&yacute;' },
  { character: '?', decimal: '&#190;', escape: '&frac34;' },
  { character: 'Þ', decimal: '&#222;', escape: '&THORN;' },
  { character: 'þ', decimal: '&#254;', escape: '&thorn;' },
  { character: '?', decimal: '&#191;', escape: '&iquest;' },
  { character: 'ß', decimal: '&#223;', escape: '&szlig;' },
  { character: 'ÿ', decimal: '&#255;', escape: '&yuml;' },
  { character: 'À', decimal: '&#192;', escape: '&Agrave;' },
  { character: 'à', decimal: '&#224;', escape: '&agrave;' }
]
</script>

<style scoped lang="scss">
// 参考 MimeType 页面样式：内容区全高、卡片撑满、表格填充并内部滚动
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 20px; // 覆盖全局 .container 的 padding，仅保留左右边距
}

.tool-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 0; // 覆盖全局 .tool-card 的 padding: 24px
  margin-bottom: 0; // 覆盖全局 .tool-card 的 margin-bottom: 20px

  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 20px;
  }
}

.table-wrap {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;

  :deep(.el-table) {
    flex: 1;
    width: 100%;
  }
}

// 列内容：点击可复制
.copyable {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--el-color-primary);
  word-break: break-all;
  transition: color 0.2s;

  &:hover {
    color: var(--el-color-primary-light-3);
  }

  .copy-icon {
    flex-shrink: 0;
    font-size: 14px;
  }
}
</style>
