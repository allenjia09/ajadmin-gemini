<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useRoute } from 'vue-router'
import {
  NDataTable,
  NButton,
  NSpace,
  useMessage,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NDatePicker,
  NSelect,
  NTag,
  NStatistic,
  NNumberAnimation,
  NGrid,
  NGridItem,
  NCard,
} from 'naive-ui'
import { useProjectStore } from '../stores/project'

const route = useRoute()
const projectStore = useProjectStore()
const message = useMessage()

const projectId = computed(() => route.params.id as string)
const project = computed(() => projectStore.projects.find((p) => p.id === projectId.value))

const showModal = ref(false)
const modalTitle = ref('')
const editKey = ref<string | null>(null)
const formData = ref<any>({})

const computeValue = (row: any, field: any) => {
  if (!field.formula) return 0
  let formula = field.formula
  project.value?.fields.forEach((f) => {
    if (f.alias && formula.includes(`[${f.alias}]`)) {
      const value = row[f.key] || 0
      formula = formula.replace(new RegExp(`\\[${f.alias}\\]`, 'g'), value.toString())
    }
  })
  try {
    return eval(formula) || 0
  } catch (e) {
    return 0
  }
}

const summaryData = computed(() => {
  if (!project.value || project.value.data.length === 0) return []

  const results: { label: string; value: number }[] = []

  // 找出所有需要汇总的字段（数字或计算）
  project.value.fields.forEach((f) => {
    if (f.type === 'number' || f.type === 'compute') {
      let sum = 0
      project.value?.data.forEach((row) => {
        if (f.type === 'number') {
          sum += Number(row[f.key] || 0)
        } else {
          sum += computeValue(row, f)
        }
      })
      results.push({ label: f.name + '合计', value: sum })
    }
  })

  return results
})

const columns = computed(() => {
  if (!project.value) return []

  const cols: any[] = project.value.fields.map((field) => ({
    title: field.name,
    key: field.key,
    render: (row: any) => {
      const val = row[field.key]
      if (field.type === 'compute') {
        const res = computeValue(row, field)
        return h('span', { style: 'font-weight: bold; color: #18a058' }, { default: () => res })
      }
      if (field.type === 'date' && val) {
        return new Date(val).toLocaleDateString()
      }
      if (field.type === 'select' && val) {
        return h(NTag, { type: 'primary', bordered: false }, { default: () => val })
      }
      return val
    },
  }))

  cols.push({
    title: '操作',
    key: 'actions',
    render: (row: any) =>
      h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              {
                tertiary: true,
                size: 'small',
                onClick: () => openEditModal(row),
              },
              { default: () => '编辑' },
            ),
            h(
              NButton,
              {
                type: 'error',
                size: 'small',
                onClick: () => projectStore.deleteDataRow(projectId.value, row.key),
              },
              { default: () => '删除' },
            ),
          ],
        },
      ),
  })

  return cols
})

const openAddModal = () => {
  modalTitle.value = '新增' + project.value?.name
  editKey.value = null
  formData.value = {}
  showModal.value = true
}

const openEditModal = (row: any) => {
  modalTitle.value = '编辑' + project.value?.name
  editKey.value = row.key
  formData.value = { ...row }
  showModal.value = true
}

const handleConfirm = () => {
  // 简易必填校验
  if (project.value) {
    for (const field of project.value.fields) {
      if (field.required && !formData.value[field.key]) {
        message.error(`请输入${field.name}`)
        return
      }
    }
  }

  if (editKey.value) {
    projectStore.updateDataRow(projectId.value, editKey.value, formData.value)
    message.success('更新成功')
  } else {
    projectStore.addDataRow(projectId.value, formData.value)
    message.success('添加成功')
  }
  showModal.value = false
}

const getReadableFormula = (formula: string) => {
  if (!formula) return ''
  let readable = formula
  project.value?.fields.forEach((f) => {
    if (f.alias && readable.includes(`[${f.alias}]`)) {
      // 替换为纯名称，不带中括号
      readable = readable.replace(new RegExp(`\\[${f.alias}\\]`, 'g'), f.name)
    }
  })
  return readable
}
</script>

<template>
  <div v-if="project">
    <n-space justify="space-between" align="center" style="margin-bottom: 16px">
      <h2>{{ project.name }} - 数据管理</h2>
      <n-button type="primary" @click="openAddModal">新增数据</n-button>
    </n-space>

    <!-- 数据汇总看板 -->
    <n-grid :cols="4" :x-gap="12" style="margin-bottom: 24px">
      <n-grid-item v-for="item in summaryData" :key="item.label">
        <n-card embedded :bordered="false">
          <n-statistic :label="item.label">
            <n-number-animation :from="0" :to="item.value" :precision="2" />
          </n-statistic>
        </n-card>
      </n-grid-item>
    </n-grid>

    <n-data-table :columns="columns" :data="project.data" />

    <n-modal v-model:show="showModal" preset="card" :title="modalTitle" style="width: 500px">
      <n-form>
        <n-form-item
          v-for="field in project.fields"
          :key="field.key"
          :label="field.name"
          :required="field.required"
        >
          <template v-if="field.type === 'number'">
            <n-input-number
              v-model:value="formData[field.key]"
              style="width: 100%"
              placeholder="请输入数字"
            />
          </template>
          <template v-else-if="field.type === 'date'">
            <n-date-picker v-model:value="formData[field.key]" type="date" style="width: 100%" />
          </template>
          <template v-else-if="field.type === 'select'">
            <n-select
              v-model:value="formData[field.key]"
              :options="field.options?.map((o) => ({ label: o, value: o }))"
              placeholder="请选择"
            />
          </template>
          <template v-else-if="field.type === 'compute'">
            <div style="color: #666; font-style: italic">
              该字段将根据公式 [{{ getReadableFormula(field.formula ?? '') }}] 自动计算
            </div>
          </template>
          <template v-else>
            <n-input v-model:value="formData[field.key]" :placeholder="'请输入' + field.name" />
          </template>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showModal = false">取消</n-button>
          <n-button type="primary" @click="handleConfirm">
            {{ editKey ? '更新' : '提交' }}
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
  <div v-else>项目不存在</div>
</template>
