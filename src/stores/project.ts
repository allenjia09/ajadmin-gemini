import { defineStore } from 'pinia'
import { ref } from 'vue'
import { pb } from '@/lib/pocketbase'

export interface ProjectField {
  name: string
  key: string
  type: 'string' | 'date' | 'number' | 'select' | 'compute'
  required: boolean
  options?: string[]
  alias?: string
  formula?: string
}

export interface Project {
  id: string
  name: string
  fields: ProjectField[]
  data: any[]
}

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)

  // 初始化：加载所有模块定义
  async function loadProjects() {
    loading.value = true
    try {
      const records = await pb.collection('modules').getFullList()
      projects.value = records.map((r: any) => ({
        id: r.id,
        name: r.name,
        fields: r.fields || [],
        data: [], // 数据后续按需加载
      }))
    } catch (err) {
      console.error('Failed to load modules:', err)
    } finally {
      loading.value = false
    }
  }

  // 加载指定模块的数据
  async function loadProjectData(projectId: string) {
    const project = projects.value.find((p) => p.id === projectId)
    if (!project) return

    try {
      const records = await pb.collection('module_data').getFullList({
        filter: `module="${projectId}"`,
        sort: '-created',
      })

      // 映射 PB 记录到前端各行数据 (保留 PB ID 以便更新)
      project.data = records.map((r: any) => ({
        ...r.content,
        key: r.id, // 使用 PB 的 ID 作为 key
      }))
    } catch (err) {
      console.error('Failed to load module data:', err)
    }
  }

  async function addProject(name: string, fields: ProjectField[]) {
    try {
      const record = await pb.collection('modules').create({
        name,
        fields,
      })
      projects.value.push({
        id: record.id,
        name: record.name,
        fields: record.fields,
        data: [],
      })
      return record.id
    } catch (err) {
      console.error('Create module failed:', err)
      throw err
    }
  }

  async function updateProject(id: string, name: string, fields: ProjectField[]) {
    try {
      const record = await pb.collection('modules').update(id, {
        name,
        fields,
      })
      const project = projects.value.find((p) => p.id === id)
      if (project) {
        project.name = record.name
        project.fields = record.fields
      }
    } catch (err) {
      console.error('Update module failed:', err)
    }
  }

  async function deleteProject(id: string) {
    try {
      await pb.collection('modules').delete(id)
      projects.value = projects.value.filter((p) => p.id !== id)
    } catch (err) {
      console.error('Delete module failed:', err)
    }
  }

  async function addDataRow(projectId: string, row: any) {
    try {
      // row 包含 content，PB 中存 content 字段
      // key 应该是临时生成的，无需传给 backend 的 content
      const { key, ...content } = row

      const record = await pb.collection('module_data').create({
        module: projectId,
        content: content,
      })

      const project = projects.value.find((p) => p.id === projectId)
      if (project) {
        project.data.push({
          ...content,
          key: record.id,
        })
      }
    } catch (err) {
      console.error('Add row failed:', err)
    }
  }

  async function updateDataRow(projectId: string, rowKey: string, updatedRow: any) {
    try {
      const { key, ...content } = updatedRow
      // rowKey 即 record.id
      await pb.collection('module_data').update(rowKey, {
        content: content,
      })

      const project = projects.value.find((p) => p.id === projectId)
      if (project) {
        const index = project.data.findIndex((r) => r.key === rowKey)
        if (index !== -1) {
          project.data[index] = { ...content, key: rowKey }
        }
      }
    } catch (err) {
      console.error('Update row failed:', err)
    }
  }

  async function deleteDataRow(projectId: string, rowKey: string) {
    try {
      await pb.collection('module_data').delete(rowKey)

      const project = projects.value.find((p) => p.id === projectId)
      if (project) {
        project.data = project.data.filter((r) => r.key !== rowKey)
      }
    } catch (err) {
      console.error('Delete row failed:', err)
    }
  }

  return {
    projects,
    loading,
    loadProjects,
    loadProjectData,
    addProject,
    updateProject,
    deleteProject,
    addDataRow,
    updateDataRow,
    deleteDataRow,
  }
})
