<template>
  <el-container>
    <el-aside width="80px">
      <el-menu
        background-color="#222"
        text-color="#fff"
        :router="true"
      >
        <el-menu-item index="setting">
          <span slot="title">跑数</span>
        </el-menu-item>
        <el-menu-item index="result">
          <span slot="title">结果</span>
        </el-menu-item>
        <el-menu-item index="md5">
          <span slot="title">md5</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>powered by fuzhao and 采集组</el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  import './app.less'
  export default {
    name: 'app',
    data() {
      return {

      }
    },

  }
</script>
