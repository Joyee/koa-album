<template>
  <el-form class="login" :model="form" label-width="120px">
    <el-form-item label="用户名">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="form.password" placeholder="123" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
export default {
  name: 'Login',
}
</script>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// do not use same name with ref
const form = reactive({
  name: '',
  password: '',
})

const onSubmit = () => {
  router.push({ name: 'Home' })
}
</script>

<style lang="scss" scoped>
.login {
  width: 400px;
}
</style>