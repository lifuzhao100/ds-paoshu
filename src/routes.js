/**
 * @Author: lifuzhao
 * @Date: 2019-03-22
 * @Project: vue-extension
 */
import Empty from './empty'
import Setting from './pages/setting'
import Result from './pages/result'
import Md5 from './pages/md5'
export default [{
  path: '/',
  redirect: '/setting',
  component: Empty,
  children: [{
    path: '/setting',
    component: Setting
  }, {
    path: '/result',
    component: Result
  }, {
    path: '/md5',
    component: Md5
  }]
}]