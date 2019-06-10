<template>
  <div>
    <el-form ref="form" :model="form" label-width="100px" label-suffix="：">
      <el-form-item label="导出文件名">
        <el-input style="max-width: 600px;" size="small" v-model="form.name" placeholder="请输入导出文件名"></el-input>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          size="small"
          v-model="form.date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="站点">
        <el-radio-group v-model="form.site">
          <el-radio v-for="site in sites" :key="site.id" :label="site.id">{{site.title}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="url">
        <el-input type="textarea" v-model="form.url" placeholder="请输入url，每行一条url"></el-input>
        <p>共输入 {{ urlList.length }} 条url</p>
      </el-form-item>
      <el-form-item label="操作">
        <el-button size="small" :disabled="add_disabled" type="primary" @click="addRow">确定</el-button>
        <el-button :disabled="upload_disabled" :loading="upload_loading" size="small" type="success" @click="upload">
          提交
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      size="small"
      :data="settingList"
      style="width: 100%">
      <el-table-column
        prop="site_name"
        label="站点"
        width="100">
      </el-table-column>
      <el-table-column
        prop="url"
        label="url"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="deleteRow(scope.$index)">删除</el-button>
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
  import moment from 'moment'
  import md5 from 'js-md5'
  import qs from 'qs'

  let sites = [{
    title: '聚美优品',
    id: '674'
  }, {
    title: '亚马逊中文',
    id: '2713'
  }, {
    title: '洋码头',
    id: '4429'
  }, {
    title: '网易考拉',
    id: '299'
  }, {
    title: '唯品会',
    id: '8591'
  }, {
    title: '国美',
    id: '282'
  }, {
    title: '天猫',
    id: '38'
  }, {
    title: '蘑菇街',
    id: '20560'
  }, {
    title: '当当网',
    id: '592'
  }, {
    title: '苏宁',
    id: '21174'
  }, {
    title: '京东',
    id: '21172'
  }, {
    title: '淘宝',
    id: '236'
  }]
  const deepClone = (data) => JSON.parse(JSON.stringify(data))
  export default {
    name: "setting",
    data() {
      return {
        form: {
          name: '',
          date: [],
          site: '',
          url: ''
        },
        sites,
        settingList: [],
        format: 'YYYYMMDDHHmmSS',
        upload_loading: false
      }
    },
    computed: {
      urlList() {
        let urls = this.form.url
        return urls.split(/[\r\n]+/).filter(url => !!url)
      },
      add_disabled() {
        let form = this.form
        return !(form.site && this.urlList.length)
      },
      upload_disabled() {
        let form = this.form,
          settingList = this.settingList
        return !form.name || form.date.length === 0 || settingList.length === 0
      }
    },
    mounted(){
      let query = this.$route.query
      if(query.id){
        this.init()
      }
    },
    methods: {
      init(){
        let resultList = localStorage.getItem('resultList'),
          err = false
        if(!resultList) return
        try {
          resultList = JSON.parse(resultList)
        }catch (e) {
          err = true
        }
        if(err) return
        let len = resultList.length,
          query = this.$route.query,
          current_job
        for (let i = 0; i < len; i++){
          let job = resultList[i]
          if(job.id === query.id){
            current_job = job
            break
          }
        }
        if(!current_job) return
        this.form.name = current_job.name.replace(/_[0-9]+$/, '')
        this.form.date = [moment(current_job.end, this.format).toDate(), moment().hour(0).minute(0).second(0).millisecond(0).toDate()]
        this.settingList = current_job.url.map(url_item => {
          let new_url
          for (let i = 0; i < sites.length; i++){
            let site = sites[i]
            if(site.title === url_item.title){
              new_url = {
                site_name: site.title,
                url: url_item.url,
                params: [{
                  full_url: url_item.url,
                  crawler: site.id
                }]
              }
            }
          }
          return new_url
        }).filter(url_item => !!url_item)
      },
      addRow() {
        let form = this.form
        let site_name
        for (let i = 0; i < sites.length; i++) {
          if (sites[i].id === form.site) {
            site_name = sites[i].title
            break
          }
        }
        this.settingList.push({
          site_name: site_name,
          url: this.urlList.join(','),
          params: this.urlList.map(url => {
            return {
              full_url: url,
              crawler: form.site
            }
          })
        })
        this.form.site = ''
        this.form.url = ''
      },
      deleteRow(index) {
        this.settingList.splice(index, 1)
      },
      upload() {
        let form = deepClone(this.form),
          settingList = this.settingList
        if (!form.name) {
          this.$message({
            type: 'error',
            message: '请输入导出的文件名'
          })
          return
        }
        form.name = form.name + '_' + moment().format('x')
        if (!form.date.length) {
          this.$message({
            type: 'error',
            message: '请选择时间'
          })
          return
        }
        if (!settingList.length) {
          this.$message({
            type: 'error',
            message: '请增加站点和链接'
          })
          return
        }
        this.$confirm('防止误触，确认后提交哦', '萌萌哒提示你', {
          type: 'warning'
        }).then(() => {
          let seeds = [],
            format = this.format,
            start = form.date[0],
            end = form.date[1]
          settingList.forEach(setting => {
            seeds = seeds.concat(setting.params)
          })
          this.upload_loading = true
          axios({
            url: `http://api.rhino.datatub.com/app/v2/start`,
            method: 'post',
            headers: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              injectType: 'search_support',
              appId: 10268,
              start: moment(start).format(format),
              end: moment(end).format(format)
            },
            data: qs.stringify({
              seeds: JSON.stringify(seeds)
            })
          }).then((res) => {
            this.upload_loading = false
            res = res.data
            if (!res) {
              this.$message({
                type: 'error',
                message: '提交失败'
              })
              return
            }
            if (res.result.toLowerCase() === 'success') {
              let resultList = localStorage.getItem('resultList') || '[]'
              try {
                resultList = JSON.parse(resultList)
              } catch (e) {
                resultList = []
              }
              this.$message({
                type: 'success',
                message: '提交成功'
              })
              let site_and_url = [],
                sites = []
              seeds.forEach(seed => {
                for (let i = 0; i < this.sites.length; i++) {
                  let site = this.sites[i]
                  if (site.id === seed.crawler) {
                    if (sites.indexOf(site.title) === -1) {
                      sites.push(site.title)
                    }
                    site_and_url.push({
                      title: site.title,
                      url: seed.full_url
                    })
                    break
                  }
                }

              })
              let id = res.id,
                pk = md5(id).slice(0, 3)
              resultList.unshift({
                name: form.name,
                id: id,
                pk: pk,
                url: site_and_url,
                sites: sites.join(','),
                _start: moment(start).format(format),
                _end: moment(end).format(format),
                start: moment(start, format).format('YYYY-MM-DD HH:mm:SS'),
                end: moment(end, format).format('YYYY-MM-DD HH:mm:SS'),
                status: 'waiting',
                command: `sh run.sh LocalExportCli -format csv -ht 'dt.rhino.tmp.ecomm.comment' -id '${pk}|${id}' -o ${form.name}.csv -qfile eccom_cmt.qfile  -split "," -head --is_point_prefix`
              })
              localStorage.setItem('resultList', JSON.stringify(resultList))
              this.$router.push({
                path: '/result'
              })
              return
            }
            let err = res.message || res.msg || res
            this.$message({
              type: 'error',
              message: err
            })
          }).catch(res => {
            this.upload_loading = false
            let err
            if (!res) {
              err = '提交失败'
            } else {
              err = res.message || res.msg || res
            }
            this.$message({
              type: 'error',
              message: err
            })
          })
        }).catch(() => {
        })

      }
    }
  }
</script>

<style scoped>

</style>