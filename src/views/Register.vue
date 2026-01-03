<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NForm, NFormItem, NInput, NButton, useMessage } from 'naive-ui'

const router = useRouter()
const message = useMessage()

const formValue = ref({
  username: '',
  password: '',
  confirmPassword: '',
})

const handleRegister = (e: MouseEvent) => {
  e.preventDefault()
  if (formValue.value.password !== formValue.value.confirmPassword) {
    message.error('两次输入的密码不一致')
    return
  }
  // Mock registration
  message.success('注册成功！请登录。')
  router.push('/login')
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="register-container">
    <n-card title="创建管理员账号" style="width: 400px">
      <n-form :model="formValue">
        <n-form-item path="username" label="用户名">
          <n-input v-model:value="formValue.username" placeholder="请输入用户名" />
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
