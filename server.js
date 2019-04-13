/**
 * @Author: lifuzhao
 * @Date: 2019-04-12
 * @Project: ds-paoshu
 */
const koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body')
const send = require('koa-send')
const fs = require('fs')
const path = require('path')
const app = new koa()
const router = new Router()
const port = 10987
app.use(koaBody({
  formLimit: 1024 * 1024 * 1024,
  jsonLimit: 1024 * 1024 * 1024
}))
router.get('/hello-world', ctx => {
  ctx.status = 200
  ctx.body = 'hello world , wish u have a nice day'
})
router.get('/download/:name', async ctx => {
  await send(ctx, ctx.request.url)
})
let jobs = []
router.get('/job/look', ctx => {
  ctx.status = 200
  ctx.body = jobs
})
router.get('/job/list', ctx => {
  ctx.status = 200
  ctx.body = jobs
  jobs = []
})
router.get('/job/status', ctx => {
  ctx.status = 200
  let query = ctx.query
  let flag = fs.existsSync(path.resolve('./download/', query.name + '.csv'))
  ctx.body = {
    status: flag ? 'done' : 'running'
  }
})
router.post('/job/add', ctx => {
  ctx.status = 200
  let data = ctx.request.body
  let index = jobs.findIndex(job => job.id === data.id)
  if(index === -1){
    jobs.push({
      id: data.id,
      name: data.name
    })
  }
  ctx.body = {
    status: 'success'
  }
})
router.post('/job/upload', ctx => {
  ctx.status = 200
  let data = ctx.request.body
  fs.writeFileSync('./download/' + data.name + '.csv', data.data)
  ctx.body = {
    status: 'success'
  }
})

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(port)
console.log('serve is listening at port ' + port)