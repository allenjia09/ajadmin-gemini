import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ProjectField {
  name: string
  key: string
  type: 'string' | 'date' | 'number' | 'select' | 'compute'
  required: boolean
  options?: string[]
  alias?: string // 用于计算的标识，如 A, B
  formula?: string // 计算公式，如 [A] + [B]
}

export interface Project {
  id: string
  name: string
  fields: ProjectField[]
  data: any[]
}

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([
    {
      id: 'mock-1',
      name: '员工管理',
      fields: [
        { name: '姓名', key: 'name', type: 'string', required: true },
        {
          name: '部门',
          key: 'dept',
          type: 'select',
          required: true,
          options: ['技术部', '市场部', '人事部', '财务部'],
        },
        { name: '入职日期', key: 'joinDate', type: 'date', required: false },
        { name: '职级', key: 'level', type: 'number', required: false },
      ],
      data: [
        { key: '1', name: '张三', dept: '技术部', joinDate: 1704230400000, level: 5 },
        { key: '2', name: '李四', dept: '市场部', joinDate: 1704316800000, level: 3 },
      ],
    },
    {
      id: 'mock-2',
      name: '工资管理',
      fields: [
        { name: '员工姓名', key: 'empName', type: 'string', required: true },
        { name: '基本工资', key: 'baseSal', type: 'number', required: true, alias: 'S1' },
        { name: '绩效奖金', key: 'bonus', type: 'number', required: true, alias: 'S2' },
        { name: '总计', key: 'total', type: 'compute', required: false, formula: '[S1]+[S2]' },
      ],
      data: [
        { key: '101', empName: '张三', baseSal: 15000, bonus: 3000 },
        { key: '102', empName: '李四', baseSal: 12000, bonus: 2500 },
      ],
    },
  ])

  function addProject(name: string, fields: ProjectField[]) {
    const id = Date.now().toString()
    projects.value.push({
      id,
      name,
      fields,
      data: [],
    })
    return id
  }

  function updateProject(id: string, name: string, fields: ProjectField[]) {
    const project = projects.value.find((p) => p.id === id)
    if (project) {
      project.name = name
      project.fields = fields
    }
  }

  function deleteProject(id: string) {
    projects.value = projects.value.filter((p) => p.id !== id)
  }

  function addDataRow(projectId: string, row: any) {
    const project = projects.value.find((p) => p.id === projectId)
    if (project) {
      project.data.push({ ...row, key: Date.now().toString() })
    }
  }

  function updateDataRow(projectId: string, rowKey: string, updatedRow: any) {
    const project = projects.value.find((p) => p.id === projectId)
    if (project) {
      const index = project.data.findIndex((r) => r.key === rowKey)
      if (index !== -1) {
        project.data[index] = { ...updatedRow, key: rowKey }
      }
    }
  }

  function deleteDataRow(projectId: string, rowKey: string) {
    const project = projects.value.find((p) => p.id === projectId)
    if (project) {
      project.data = project.data.filter((r) => r.key !== rowKey)
    }
  }

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    addDataRow,
    updateDataRow,
    deleteDataRow,
  }
})
