<script setup lang="ts">
import { ref } from 'vue'
import {
  NCard,
  NButton,
  NSpace,
  NInput,
  NForm,
  NFormItem,
  NDataTable,
  useMessage,
  NModal,
  NIcon,
  NSelect,
  NSwitch,
} from 'naive-ui'
import { useProjectStore } from '../stores/project'

const projectStore = useProjectStore()
const message = useMessage()

const showModal = ref(false)
const modalTitle = ref('')
const editId = ref<string | null>(null)
const projectName = ref('')
const customFields = ref<
  {
    name: string
    type: 'string' | 'date' | 'number' | 'select' | 'compute'
    required: boolean
    optionsText?: string
    alias?: string
    formula?: string
    key?: string
  }[]
>([])

const typeOptions = [
  { label: '文本', value: 'string' },
  { label: '日期', value: 'date' },
  { label: '数字', value: 'number' },
  { label: '下拉选择', value: 'select' },
  { label: '计算字段', value: 'compute' },
]

const openAddModal = () => {
  modalTitle.value = '新增自定义项目'
  editId.value = null
  projectName.value = ''
  customFields.value = []
  showModal.value = true
}

const openEditModal = (row: any) => {
  modalTitle.value = '编辑自定义项目'
  editId.value = row.id
  projectName.value = row.name
  // 保持原有 key，方便数据对应
  customFields.value = row.fields.map((f: any) => ({
    name: f.name,
    key: f.key,
    type: f.type || 'string',
    required: f.required ?? false,
    optionsText: f.options ? f.options.join(',') : '',
    alias: f.alias || '',
    formula: f.formula || '',
  }))
  showModal.value = true
}

const addField = () => {
  customFields.value.push({
    name: '',
    type: 'string',
    required: false,
    optionsText: '',
    alias: '',
    formula: '',
  })
}

const removeField = (index: number) => {
  customFields.value.splice(index, 1)
}

const handleConfirm = () => {
  if (!projectName.value) {
    message.error('请输入项目名称')
    return
  }

  // 校验标识格式：只能是英文或数字，且不能以数字开头
  const aliasRegex = /^[a-zA-Z][a-zA-Z0-9]*$/
  for (const f of customFields.value) {
    if (f.alias && !aliasRegex.test(f.alias)) {
      message.error(
        `字段“${f.name || '未命名'}”的标识“${f.alias}”格式不正确（只能是英文数字且不能以数字开头）`,
      )
      return
    }
  }

  const fields = customFields.value
    .filter((f) => f.name.trim() !== '')
    .map((f) => ({
      name: f.name,
      type: f.type,
      required: f.required,
      options:
        f.type === 'select'
          ? f.optionsText
              ?.split(',')
              .map((s) => s.trim())
              .filter((s) => s !== '')
          : undefined,
      alias: f.alias,
      formula: f.formula,
      key: f.key || `field_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    }))

  if (editId.value) {
    projectStore.updateProject(editId.value, projectName.value, fields)
    message.success('更新成功')
  } else {
    projectStore.addProject(projectName.value, fields)
    message.success('项目创建成功')
  }
  showModal.value = false
}

const columns = [
  { title: '项目名称', key: 'name' },
  { title: '字段数量', key: 'fields', render: (row: any) => row.fields.length },
  {
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
              { tertiary: true, size: 'small', onClick: () => openEditModal(row) },
              { default: () => '编辑' },
            ),
            h(
              NButton,
              { type: 'error', size: 'small', onClick: () => projectStore.deleteProject(row.id) },
              { default: () => '删除' },
            ),
          ],
        },
      ),
  },
]

import { h } from 'vue'
</script>

<template>
  <div>
    <n-space justify="space-between" align="center" style="margin-bottom: 16px">
      <h2>模块定义与管理</h2>
      <n-button type="info" @click="openAddModal">新增项目</n-button>
    </n-space>

    <n-data-table :columns="columns" :data="projectStore.projects" />

    <n-modal
      v-model:show="showModal"
      preset="card"
      :title="modalTitle"
      style="width: 800px"
      :bordered="false"
    >
      <n-form>
        <n-form-item label="项目名称">
          <n-input v-model:value="projectName" placeholder="比如：员工管理" size="large" />
        </n-form-item>

        <div
          v-for="(field, index) in customFields"
          :key="index"
          style="margin-bottom: 20px; background-color: #fafafc; padding: 16px; border-radius: 8px"
        >
          <n-space align="center" justify="space-between" :wrap="false">
            <n-space align="center">
              <span style="font-weight: 500">字段 {{ index + 1 }}</span>
              <n-input
                v-model:value="field.alias"
                placeholder="标识 (A)"
                style="width: 100px"
                :allow-input="(v: string) => /^[a-zA-Z0-9]*$/.test(v)"
              />
              <n-input v-model:value="field.name" placeholder="名称" style="width: 150px" />
              <n-select v-model:value="field.type" :options="typeOptions" style="width: 120px" />
              <n-input
                v-if="field.type === 'select'"
                v-model:value="field.optionsText"
                placeholder="选项，用逗号分隔"
                style="width: 180px"
              />
              <n-input
                v-if="field.type === 'compute'"
                v-model:value="field.formula"
                placeholder="公式，如: [A]+[B]"
                style="width: 180px"
              />
              <span style="margin-left: 12px">必填：</span>
              <n-switch v-model:value="field.required" size="small" />
            </n-space>

            <n-button type="error" ghost @click="removeField(index)" size="small"> 删除 </n-button>
          </n-space>
        </div>

        <n-button dashed block @click="addField" style="margin-top: 10px; height: 45px">
          增加一个字段属性
        </n-button>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="showModal = false">取消</n-button>
          <n-button type="primary" @click="handleConfirm">{{
            editId ? '确定更新' : '确定创建'
          }}</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>
