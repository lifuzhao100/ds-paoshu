/**
 * @Author: lifuzhao
 * @Date: 2019-04-11
 * @Project: ds-paoshu
 */
var axios = require('axios')
var qs = require('qs')
var child_process = require('child_process')
var fs = require('fs')
var path = require('path')
var host = 'http://119.29.100.27:10987'

function handler(){
  function execute(job){
    child_process.execSync(job.command)
    var data = fs.readFileSync(path.resolve('./', job.name + '.csv'), 'utf8')
    axios({
      url: `${host}/job/upload`,
      method: 'post',
      data: qs.stringify({
        name: job.name,
        data: data
      })
    })
  }
  var now = new Date(),
    hour = now.getHours()
  if(hour > 1 && hour < 9){
    return
  }
  axios({
    url: `${host}/job/list`,
    method: 'get'
  })
    .then(res => {
      var data = res.data
      if(data.length > 0){
        data.forEach(job => {
          if(job.command){
            execute(job)
          }
        })
      }
    })
}
setInterval(handler, 120000)