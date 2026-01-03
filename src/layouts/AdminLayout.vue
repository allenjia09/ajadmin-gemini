<script setup lang="ts">
import { h, ref, computed, type Component, onMounted } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import type { MenuOption } from 'naive-ui'
import {
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutContent,
  NMenu,
  NButton,
  NSpace,
  NIcon,
} from 'naive-ui'
import { SettingsOutline, CubeOutline, CreateOutline, HomeOutline } from '@vicons/ionicons5'
import { useAuthStore } from '../stores/auth'
import { useProjectStore } from '../stores/project'

const router = useRouter()
const authStore = useAuthStore()
const projectStore = useProjectStore()

onMounted(() => {
  if (authStore.isLoggedIn) {
    projectStore.loadProjects()
  }
})

const renderIcon = (icon: Component) => () => h(NIcon, null, { default: () => h(icon) })

const menuOptions = computed<MenuOption[]>(() => {
  // 1. 固定菜单项
  const options: MenuOption[] = [
    {
      label: () => h(RouterLink, { to: '/admin/welcome' }, { default: () => '概览' }),
      key: 'welcome',
      icon: renderIcon(HomeOutline),
    },
    {
      label: () => h(RouterLink, { to: '/admin/custom' }, { default: () => '模块管理' }),
      key: 'custom-module',
      icon: renderIcon(SettingsOutline),
    },
  ]

  // 2. 动态项目列表
  if (projectStore.projects.length > 0) {
    options.push({ key: 'divider-projects', type: 'divider' })
    projectStore.projects.forEach((p) => {
      options.push({
        label: () => h(RouterLink, { to: `/admin/project/${p.id}` }, { default: () => p.name }),
        key: `project-${p.id}`,
        icon: renderIcon(CubeOutline),
      })
    })
  }

  // 3. 特色小功能（底部）
  options.push(
    { key: 'divider-features', type: 'divider' },
    {
      type: 'group',
      label: '特色小功能',
      key: 'features-group',
      children: [
        {
          label: () => h(RouterLink, { to: '/admin/bazi' }, { default: () => '八字测算' }),
          key: 'bazi',
          icon: renderIcon(CreateOutline),
        },
      ],
    },
  )

  return options
})

const collapsed = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <n-layout has-sider style="height: 100vh">
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <div style="padding: 16px; font-weight: bold; font-size: 18px; text-align: center">
        <span v-if="!collapsed">管理后台系统</span>
        <span v-else>管</span>
      </div>
      <n-menu
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
      />
    </n-layout-sider>
    <n-layout>
      <n-layout-header bordered style="padding: 16px">
        <n-space justify="space-between" align="center">
          <!-- 安全访问 user 属性，防止 null 报错 -->
          <span>欢迎回来, {{ authStore.user?.username || authStore.user?.email || '管理员' }}</span>
          <n-button type="error" size="small" @click="handleLogout">退出登录</n-button>
        </n-space>
      </n-layout-header>
      <n-layout-content content-style="padding: 24px;">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
