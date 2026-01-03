<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  NCard,
  NStatistic,
  NNumberAnimation,
  NGrid,
  NGridItem,
  NSpace,
  NButton,
  NIcon,
  NResult,
} from 'naive-ui'
import { CubeOutline, SettingsOutline, CreateOutline } from '@vicons/ionicons5'
import { useProjectStore } from '../stores/project'

const projectStore = useProjectStore()
const router = useRouter()

const projectCount = computed(() => projectStore.projects.length)

const goToCustom = () => {
  router.push('/admin/custom')
}
</script>

<template>
  <div class="welcome-container">
    <div class="header">
      <h1>欢迎使用后台管理系统</h1>
      <p>这里是您的项目管理中心，您可以自由定义模块并管理数据。</p>
    </div>

    <!-- 统计卡片 -->
    <n-grid :cols="4" :x-gap="24" :y-gap="24">
      <n-grid-item>
        <n-card embedded :bordered="false">
          <n-statistic label="已创建项目模块">
            <template #prefix>
              <n-icon>
                <CubeOutline />
              </n-icon>
            </template>
            <n-number-animation :from="0" :to="projectCount" />
          </n-statistic>
        </n-card>
      </n-grid-item>
    </n-grid>

    <div class="guide-section" style="margin-top: 32px">
      <h2>👋 快速上手指南</h2>
      <n-grid :cols="2" :x-gap="24" :y-gap="24">
        <!-- 步骤 1 -->
        <n-grid-item>
          <n-card title="第一步：定义模块" hoverable>
            <template #header-extra>
              <n-icon size="20" color="#18a058">
                <SettingsOutline />
              </n-icon>
            </template>
            <p>前往 <b>模块管理</b> 页面，点击“新增项目”。</p>
            <p>您可以定义字段名称、类型（文本、数字、日期、选项等），甚至设置计算公式。</p>
            <n-button dashed type="primary" @click="goToCustom">前往模块管理</n-button>
          </n-card>
        </n-grid-item>

        <!-- 步骤 2 -->
        <n-grid-item>
          <n-card title="第二步：管理数据" hoverable>
            <template #header-extra>
              <n-icon size="20" color="#2080f0">
                <CreateOutline />
              </n-icon>
            </template>
            <p>创建模块后，刷新页面，您将在左侧菜单栏看到新出现的项目。</p>
            <p>点击进入项目即可开始添加、编辑、删除数据行。系统会自动根据您的定义生成表单。</p>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<style scoped>
.welcome-container {
  padding: 0 12px;
}
.header {
  margin-bottom: 32px;
}
.header h1 {
  font-size: 28px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}
.header p {
  color: #666;
  font-size: 16px;
}
</style>
