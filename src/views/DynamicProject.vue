<script setup lang="ts">
import { ref, computed, watch, onMounted, h } from 'vue'
import { useRoute } from 'vue-router'
import {
  NCard,
  NDataTable,
  NButton,
  NSpace,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NDatePicker,
  NInputNumber,
  NSelect,
  useMessage,
  NTag,
  NGrid,
  NGridItem,
  NStatistic,
  NNumberAnimation,
  NSpin,
} from 'naive-ui'
import { useProjectStore } from '@/stores/project'

const route = useRoute()
const message = useMessage()
const projectStore = useProjectStore()

const showModal = ref(false)
const modalTitle = ref('')
const editingKey = ref<string | null>(null)
const formData = ref<any>({})
const loadingData = ref(false)
const submitting = ref(false)

const projectId = computed(() => route.params.id as string)

const currentProject = computed(() => projectStore.projects.find((p) => p.id === projectId.value))

// 数据初始化
const initData = async () => {
  if (projectId.value) {
    loadingData.value = true
    await projectStore.loadProjectData(projectId.value)
    loadingData.value = false
  }
}

onMounted(initData)
watch(projectId, initData)

const computeValue = (row: any, field: any) => {
  if (!field.formula) return 0
  let formula = field.formula
  currentProject.value?.fields.forEach((f) => {
    if (f.alias && formula.includes(`[${f.alias}]`)) {
      const value = row[f.key] || 0
      formula = formula.replace(new RegExp(`\\[${f.alias}\\]`, 'g'), value.toString())
    }
  })
  try {
    // eslint-disable-next-line no-eval
    return eval(formula) || 0
  } catch (e) {
    return 0
  }
}

const summaryData = computed(() => {
  if (!currentProject.value || currentProject.value.data.length === 0) return []

  const results: { label: string; value: number }[] = []

  currentProject.value.fields.forEach((f) => {
    if (f.type === 'number' || f.type === 'compute') {
      let sum = 0
      currentProject.value?.data.forEach((row) => {
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
  if (!currentProject.value) return []

  const cols: any[] = currentProject.value.fields.map((field) => ({
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
                onClick: () => handleDelete(row.key),
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
  modalTitle.value = '新增' + currentProject.value?.name
  editingKey.value = null
  formData.value = {}
  showModal.value = true
}

const openEditModal = (row: any) => {
  modalTitle.value = '编辑' + currentProject.value?.name
  editingKey.value = row.key
  formData.value = { ...row }
  showModal.value = true
}

const handleSubmit = async () => {
  if (!currentProject.value) return

  // 校验
  for (const field of currentProject.value.fields) {
    if (field.required && !formData.value[field.key]) {
      message.error(`请输入${field.name}`)
      return
    }
  }

  submitting.value = true
  try {
    if (editingKey.value) {
      await projectStore.updateDataRow(projectId.value, editingKey.value, formData.value)
      message.success('更新成功')
    } else {
      await projectStore.addDataRow(projectId.value, formData.value)
      message.success('添加成功')
    }
    showModal.value = false
  } catch (err) {
    message.error('操作失败')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (rowKey: string) => {
  try {
    await projectStore.deleteDataRow(projectId.value, rowKey)
    message.success('删除成功')
  } catch (err) {
    message.error('删除失败')
  }
}

const getReadableFormula = (formula: string) => {
  if (!formula) return ''
  let readable = formula
  currentProject.value?.fields.forEach((f) => {
    if (f.alias && readable.includes(`[${f.alias}]`)) {
      readable = readable.replace(new RegExp(`\\[${f.alias}\\]`, 'g'), f.name)
    }
  })
  return readable
}
</script>

<template>
  <div v-if="currentProject">
    <div v-if="loadingData" style="padding: 50px; text-align: center">
      <n-spin size="large" description="正在同步数据..." />
    </div>

    <div v-else>
      <n-space justify="space-between" align="center" style="margin-bottom: 16px">
        <h2>{{ currentProject.name }} - 数据管理</h2>
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

      <n-data-table :columns="columns" :data="currentProject.data" />

      <n-modal v-model:show="showModal" preset="card" :title="modalTitle" style="width: 500px">
        <n-form :disabled="submitting">
          <n-form-item
            v-for="field in currentProject.fields"
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
                公式: [{{ getReadableFormula(field.formula ?? '') }}] (保存自动计算)
              </div>
            </template>
            <template v-else>
              <n-input v-model:value="formData[field.key]" :placeholder="'请输入' + field.name" />
            </template>
          </n-form-item>
        </n-form>
        <template #footer>
          <n-space justify="end">
            <n-button @click="showModal = false" :disabled="submitting">取消</n-button>
            <n-button type="primary" @click="handleSubmit" :loading="submitting">
              {{ editingKey ? '更新' : '提交' }}
            </n-button>
          </n-space>
        </template>
      </n-modal>
    </div>
  </div>
  <div v-else>
    <n-card style="text-align: center; margin-top: 50px">
      <div style="color: #999; font-size: 16px">请在左侧选择一个模块进行管理</div>
    </n-card>
  </div>
</template>
