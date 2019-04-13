# ext-develop
基于vue框架的谷歌插件开发环境
## 再开发
安装依赖
```$xslt
npm install
```
开发
```$xslt
npm run serve
```
构建
```$xslt
npm run build
```
文件夹结构
* public
  * content.js 插件的content_script
  * background.js 插件的background_script
  * manifest.json 插件唯一必须的文件
* src
  * assets 静态资源
  * pages 页面
  * main.js 前端页面主入口
* dist 构建完成的文件夹
* index.js 运行在administrator center3的脚本，负责轮询获取导出文件的文件名和id，导出后发送到我的个人服务器
* server.js 运行在我[个人服务器](http://119.29.100.27:10987/hello-world)的脚本，负责对外提供接口