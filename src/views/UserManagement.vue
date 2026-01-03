<script setup lang="ts">
import { h, ref } from 'vue'
import {
  NDataTable,
  NButton,
  NSpace,
  NTag,
  useMessage,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
} from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

type User = {
  key: number
  name: string
  age: number
  address: string
  tags: string[]
}

const message = useMessage()

// 响应式数据
const data = ref<User[]>([
  { key: 0, name: '张三', age: 32, address: '北京市海淀区', tags: ['程序员', '好人'] },
  { key: 1, name: '李四', age: 42, address: '上海市浦东新区', tags: ['经理'] },
  { key: 2, name: '王五', age: 32, address: '广州市天河区', tags: ['老师', '热情'] },
])

// 弹窗状态
const showModal = ref(false)
const modalTitle = ref('')
const editKey = ref<number | null>(null)
const formValue = ref<User>({
  key: 0,
  name: '',
  age: 18,
  address: '',
  tags: [],
})

const tagOptions = [
  { label: '程序员', value: '程序员' },
  { label: '经理', value: '经理' },
  { label: '老师', value: '老师' },
  { label: '好人', value: '好人' },
  { label: '热情', value: '热情' },
]

const openModal = (mode: 'add' | 'edit', row?: User) => {
  if (mode === 'add') {
    modalTitle.value = '新增人员'
    editKey.value = null
    formValue.value = {
      key: Date.now(),
      name: '',
      age: 18,
      address: '',
      tags: [],
    }
  } else if (row) {
    modalTitle.value = '编辑人员'
    editKey.value = row.key
    formValue.value = { ...row }
  }
  showModal.value = true
}

const handleConfirm = () => {
  if (editKey.value === null) {
    // 新增
    data.value.unshift({ ...formValue.value })
    message.success('添加成功')
  } else {
    // 编辑
    const index = data.value.findIndex((item) => item.key === editKey.value)
    if (index !== -1) {
      data.value[index] = { ...formValue.value }
      message.success('修改成功')
    }
  }
  showModal.value = false
}

const createColumns = (): DataTableColumns<User> => {
  return [
    { title: '姓名', key: 'name' },
    { title: '年龄', key: 'age' },
    { title: '地址', key: 'address' },
    {
      title: '标签',
      key: 'tags',
      render(row) {
        return row.tags.map((tagKey) => {
          return h(
            NTag,
            {
              style: { marginRight: '6px' },
              type: 'info',
              bordered: false,
            },
            { default: () => tagKey },
          )
        })
      },
    },
    {
      title: '操作',
      key: 'actions',
      render(row) {
        return h(
          NSpace,
          {},
          {
            default: () => [
              h(
                NButton,
                {
                  strong: true,
                  tertiary: true,
                  size: 'small',
                  onClick: () => openModal('edit', row),
                },
                { default: () => '编辑' },
              ),
              h(
                NButton,
                {
                  strong: true,
                  type: 'error',
                  size: 'small',
                  onClick: () => {
                    data.value = data.value.filter((item) => item.key !== row.key)
                    message.success('删除成功')
                  },
                },
                { default: () => '删除' },
              ),
            ],
          },
        )
      },
    },
  ]
}

const columns = createColumns()
const pagination = { pageSize: 10 }
</script>

<template>
  <div>
    <n-space justify="space-between" align="center" style="margin-bottom: 16px">
      <h2>人员信息管理</h2>
      <n-button type="primary" @click="openModal('add')">新增人员</n-button>
    </n-space>

    <n-data-table :columns="columns" :data="data" :pagination="pagination" :bordered="false" />

    <n-modal v-model:show="showModal" preset="card" :title="modalTitle" style="width: 500px">
      <n-form :model="formValue">
        <n-form-item label="姓名" path="name">
          <n-input v-model:value="formValue.name" placeholder="请输入姓名" />
        </n-form-item>
        <n-form-item label="年龄" path="age">
          <n-input-number v-model:value="formValue.age" style="width: 100%" />
        </n-form-item>
        <n-form-item label="地址" path="address">
          <n-input v-model:value="formValue.address" placeholder="请输入地址" />
        </n-form-item>
        <n-form-item label="标签" path="tags">
          <n-select
            v-model:value="formValue.tags"
            multiple
            :options="tagOptions"
            placeholder="请选择标签"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showModal = false">取消</n-button>
          <n-button type="primary" @click="handleConfirm">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>
