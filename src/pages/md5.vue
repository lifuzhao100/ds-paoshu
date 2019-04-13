<template>
  <el-form ref="form" :model="form" label-width="80px" label-suffix="：">
    <el-form-item label="输入">
      <el-input style="max-width: 600px;" size="small" v-model.trim="input" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="结果">
      <p style="line-height: 30px">{{result}}</p>
    </el-form-item>
  </el-form>
</template>

<script>
  /**
   * @Author: lifuzhao
   * @Date: 2019-04-13
   * @Project: ds-paoshu
   */
  import md5 from 'js-md5'
  export default {
    name: "md5",
    data(){
      return {
        input: ''
      }
    },
    computed: {
      result(){
        if(!this.input) return ''
        return md5(this.input)
      }
    }
  }
</script>

<style scoped>

</style>