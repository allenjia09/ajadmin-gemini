<script setup lang="ts">
import { h, ref } from 'vue'
import type { Component } from 'vue'
import { useRouter } from 'vue-router'
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
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useProjectStore } from '../stores/project'
import type { MenuOption } from 'naive-ui'
import { computed } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const projectStore = useProjectStore()

import { CompassOutline } from '@vicons/ionicons5'

const renderIcon = (icon: any) => () => h(NIcon, null, { default: () => h(icon) })

const menuOptions = computed<MenuOption[]>(() => {
  const options: MenuOption[] = [
    {
      label: () => h(RouterLink, { to: '/admin/custom' }, { default: () => '模块管理' }),
      key: 'custom-module',
    },
    {
      label: () => h(RouterLink, { to: '/admin/astrolabe' }, { default: () => '星盘查询' }),
      key: 'astrolabe',
      icon: renderIcon(CompassOutline),
    },
  ]

  if (projectStore.projects.length > 0) {
    options.push({ key: 'divider-1', type: 'divider' })
    projectStore.projects.forEach((p) => {
      options.push({
        label: () => h(RouterLink, { to: `/admin/project/${p.id}` }, { default: () => p.name }),
        key: `project-${p.id}`,
      })
    })
  }
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
          <span>欢迎回来, {{ authStore.user.name }}</span>
          <n-button type="error" size="small" @click="handleLogout">退出登录</n-button>
        </n-space>
      </n-layout-header>
      <n-layout-content content-style="padding: 24px;">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
