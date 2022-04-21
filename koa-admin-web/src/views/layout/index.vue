<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <router-view v-slot="{ Component }">
            <transition mode="out-in" name="el-fade-in-linear">
              <keep-alive :include="$route.meta.keepAlive">
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Layout',
}
</script>

<script setup>
</script>

<style lang="scss" scoped>
</style>