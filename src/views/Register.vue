<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NForm, NFormItem, NInput, NButton, useMessage } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const message = useMessage()
const authStore = useAuthStore()

const formValue = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const handleRegister = async (e: MouseEvent) => {
  e.preventDefault()
  if (formValue.value.password !== formValue.value.confirmPassword) {
    message.error('两次输入的密码不一致')
    return
  }

  const { success, message: msg } = await authStore.register(
    formValue.value.username,
    formValue.value.email,
    formValue.value.password,
  )

  if (success) {
    message.success('注册成功！请登录。')
    router.push('/login')
  } else {
    message.error('注册失败: ' + msg)
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="register-container">
    <n-card title="注册账号" style="width: 400px">
      <n-form :model="formValue">
        <n-form-item path="username" label="用户名">
          <n-input v-model:value="formValue.username" placeholder="请输入用户名" />
        </n-form-item>
        <n-form-item path="email" label="邮箱">
          <n-input v-model:value="formValue.email" placeholder="请输入邮箱地址" />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="formValue.password"
            type="password"
            show-password-on="click"
            placeholder="请输入密码"
          />
        </n-form-item>
        <n-form-item path="confirmPassword" label="确认密码">
          <n-input
            v-model:value="formValue.confirmPassword"
            type="password"
            show-password-on="click"
            placeholder="请再次输入密码"
          />
        </n-form-item>
        <n-button type="primary" block @click="handleRegister"> 注册 </n-button>
        <div style="margin-top: 10px; text-align: center">
          <n-button text type="primary" @click="goToLogin">返回登录</n-button>
        </div>
      </n-form>
    </n-card>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}
</style>
