<template>
  <div>
    <el-button size="small" type="primary" @click="deleteAll">清空</el-button>
    <el-table
      :data="resultList"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="文件名"
      >
      </el-table-column>
      <el-table-column
        prop="sites"
        label="站点"
      >
        <template slot-scope="scope">
          <el-popover
            placement="bottom"
            title="站点和链接"
            trigger="hover"
            popper-class="site-url"
          >
            <span>共 {{ scope.row.url.length }} 条</span>
            <el-table
              :data="scope.row.url"
              style="width: 100%">
              <el-table-column
                prop="title"
                label="站点"
                width="180">
              </el-table-column>
              <el-table-column
                prop="url"
                label="url"
              >
              </el-table-column>
            </el-table>
            <el-button slot="reference" size="small" type="text">{{scope.row.sites}}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="时间"
      >
        <template slot-scope="scope">
          <div>
            <p>{{scope.row.start}}</p>
            <p>{{scope.row.end}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="100"
      >
        <template slot-scope="scope">
          <div>
            <p>{{scope.row.status}}</p>
            <el-button size="small" type="text" @click="viewJob(scope.row)">实时状态</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
      >
        <template slot-scope="scope">
          <div>
            <el-popover
              placement="bottom-end"
              title="导出命令"
              trigger="hover"
            >
              <ol>
                <li>打开命令行窗口</li>
                <li>ssh -p 56000 fuzhao@mnet.datatub.com</li>
                <li>输入密码</li>
                <li>cd /home/fuzhao/target</li>
                <li>{{scope.row.command}}</li>
                <li>打开新的命令行窗口</li>
                <li>scp -P 56000 fuzhao@mnet.datatub.com:/home/fuzhao/target/{{scope.row.name}}.csv ./Desktop</li>
                <li>输入密码</li>
              </ol>
              <el-button slot="reference" size="small" type="text">线下导出</el-button>
            </el-popover>
            <el-button style="margin-left: 12px;" size="small" type="text" :loading="scope.row.download !== 'done'" icon="el-icon-download" @click="download(scope.row.name)">下载</el-button>
            <el-button
              size="small"
              type="text"
              @click="reloadConfig(scope.row)"
            >重载</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  /**
   * @Author: lifuzhao
   * @Date: 2019-04-11
   * @Project: ds-paoshu
   */
  import axios from 'axios'
  import qs from 'qs'
  import moment from 'moment'
  const host = 'http://119.29.100.27:10987'
  const deepClone = (data) => JSON.parse(JSON.stringify(data))
  export default {
    name: "result",
    data(){
      return {
        resultList: []
      }
    },
    watch: {
      resultList:{
        deep: true,
        handler(list){
          localStorage.setItem('resultList', JSON.stringify(list))
        }
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init(){
        let resultList = localStorage.getItem('resultList') || '[]'
        try {
          resultList = JSON.parse(resultList)
        }catch (e) {
          resultList = []
        }
        this.resultList = resultList
        this.updateStatus()
        setInterval(() => {
          this.updateStatus()
        }, 10000)
      },
      deleteAll(){
        this.$confirm('清空后仍可通过id线下导出，前提是要有id','清空提示', {
          type: 'error'
        })
          .then(() => {
            this.resultList = []
          })
          .catch(() => {})
      },
      updateStatus(){
        let resultList = this.resultList
        resultList.forEach(result => {
          if(result.status !== 'finish'){
            axios({
              url: 'http://api.rhino.datatub.com/common/job/state',
              type: 'get',
              params: {
                job_id: result.id
              }
            }).then(res => {
              let { code, data = {} } = res.data
              if(code === 0){
                this.update(result, 'status', data.state)
                this.state = data.state
                if(data.state === 'finish'){
                  this.startDownload(result)
                }
              }
            }).catch(res => {
              let err
              if(!res){
                err = '更新状态失败'
              }else{
                err = res.message || res.msg || res || '更新状态失败'
              }
              this.update(result, 'status', err)
            })
          }else{
            if(!result.download){
              this.startDownload(result)
            }else{
              this.updateDownloadStatus(result)
            }
          }
        })
      },
      startDownload(result){
        axios({
          url: `${host}/job/add`,
          method: 'post',
          data: qs.stringify({
            name: result.name,
            id: result.id
          })
        })
          .then(res => {
            let data = res.data
            if(data.status === 'success'){
              this.update(result, 'download', 'loading')
            }
          })
      },
      updateDownloadStatus(result){
        if(result.download === 'done') return
        axios({
          url: `${host}/job/status`,
          method: 'get',
          params: {
            name: result.name
          }
        })
          .then(res => {
            let data = res.data
            if(data.status === 'done'){
              this.update(result, 'download', 'done')
            }
          })
      },
      download(name){
        window.open(`${host}/download/${name}.csv`, '_blank')
      },
      viewJob(job){
        window.open(`http://v3.rhino.datatub.com/#/gather/jobReport?jobId=${job.id}`, '_blank')
      },
      update(item, prop, value){
        let resultList = deepClone(this.resultList)
        resultList.forEach(result => {
          if(result.id === item.id){
            result[prop] = value
          }
          result.start = moment(result._start, 'YYYYMMDDHHmmSS').format('YYYY-MM-DD HH:mm:SS')
          result.end = moment(result._end,'YYYYMMDDHHmmSS').format('YYYY-MM-DD HH:mm:SS')
        })
        this.resultList = resultList
      },
      reloadConfig(job){
        location.href = '#/setting?id=' + job.id
      }
    }
  }
</script>

<style>
  .el-popover{
    max-width: 480px;
  }
</style>