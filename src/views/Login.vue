<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { NCard, NForm, NFormItem, NInput, NButton, useMessage } from 'naive-ui'

const router = useRouter()
const authStore = useAuthStore()
const message = useMessage()

const formValue = ref({
  username: '',
  password: '',
})

const handleLogin = (e: MouseEvent) => {
  e.preventDefault()
  if (formValue.value.username === 'admin' && formValue.value.password === 'admin') {
    authStore.login(formValue.value.username)
    message.success('登录成功')
    router.push('/admin')
  } else {
    message.error('账号或密码不正确')
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="login-container">
    <n-card title="后台管理系统登录" style="width: 400px">
      <n-form :model="formValue">
        <n-form-item path="username" label="用户名">
          <n-input v-model:value="formValue.username" placeholder="请输入用户名 (admin)" />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="formValue.password"
            type="password"
            show-password-on="click"
            placeholder="请输入密码 (admin)"
          />
        </n-form-item>
        <n-button type="primary" block @click="handleLogin"> 登录 </n-button>
        <div style="margin-top: 10px; text-align: center">
          <n-button text type="primary" @click="goToRegister">立即注册</n-button>
        </div>
      </n-form>
    </n-card>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}
</style>
