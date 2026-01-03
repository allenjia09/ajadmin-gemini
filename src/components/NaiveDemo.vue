<script setup lang="ts">
import { ref } from 'vue'
import {
  NButton,
  NSpace,
  NCard,
  NInput,
  NSelect,
  NTag,
  NAlert,
  NH2,
  NH3,
  NDivider,
  NGrid,
  NGi,
  NStatistic,
  NInputNumber,
  NSwitch,
  NRadio,
  NRadioButton,
  NRadioGroup,
  NCheckbox,
  NCheckboxGroup,
} from 'naive-ui'

const inputValue = ref('')
const selectValue = ref(null)
const switchValue = ref(false)
const radioValue = ref('Song 1')
const checkboxValue = ref(['Option 1'])

const options = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' },
]
</script>

<template>
  <div class="demo-container">
    <n-h2 prefix="bar">Naive UI 基础组件展示</n-h2>

    <n-space vertical size="large">
      <n-card title="按钮 Button">
        <n-space>
          <n-button>Default</n-button>
          <n-button type="primary">Primary</n-button>
          <n-button type="info">Info</n-button>
          <n-button type="success">Success</n-button>
          <n-button type="warning">Warning</n-button>
          <n-button type="error">Error</n-button>
          <n-button ghost>Ghost</n-button>
          <n-button dashed>Dashed</n-button>
        </n-space>
      </n-card>

      <n-grid :cols="2" :x-gap="12">
        <n-gi>
          <n-card title="表单 Input & Select">
            <n-space vertical>
              <n-input v-model:value="inputValue" type="text" placeholder="请输入内容" />
              <n-select v-model:value="selectValue" :options="options" placeholder="请选择" />
              <n-input-number placeholder="数字输入" />
            </n-space>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card title="选择器 Switch & Radio">
            <n-space vertical>
              <n-space align="center">
                <span>开关:</span>
                <n-switch v-model:value="switchValue" />
              </n-space>
              <n-radio-group v-model:value="radioValue" name="radiogroup">
                <n-space>
                  <n-radio value="Song 1">Radio 1</n-radio>
                  <n-radio value="Song 2">Radio 2</n-radio>
                </n-space>
              </n-radio-group>
              <n-checkbox-group v-model:value="checkboxValue">
                <n-space>
                  <n-checkbox value="Option 1" label="Checkbox 1" />
                  <n-checkbox value="Option 2" label="Checkbox 2" />
                </n-space>
              </n-checkbox-group>
            </n-space>
          </n-card>
        </n-gi>
      </n-grid>

      <n-card title="信息展示 Alert & Tag & Statistic">
        <n-space vertical>
          <n-alert title="Default Alert" type="info"> Naive UI 是一个 Vue 3 组件库。 </n-alert>
          <n-space>
            <n-tag type="success">Success Tag</n-tag>
            <n-tag type="warning">Warning Tag</n-tag>
            <n-tag type="error">Error Tag</n-tag>
            <n-tag type="info">Info Tag</n-tag>
          </n-space>
          <n-divider />
          <n-grid :cols="2">
            <n-gi>
              <n-statistic label="Active Users" value="1,234" />
            </n-gi>
            <n-gi>
              <n-statistic label="Stars" value="15.8k" />
            </n-gi>
          </n-grid>
        </n-space>
      </n-card>
    </n-space>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 24px;
  background-color: #f7f7f7;
  min-height: 100vh;
}
</style>
