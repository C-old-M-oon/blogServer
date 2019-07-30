const { userLogin } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set } = require('../db/redis')

// // 设置cookie过期时间为1天
// const getCookieExpires = () => {
//   const d = new Date()
//   d.setTime(d.getTime() + (24 * 60 * 60 *1000))
//   return d.toGMTString()
// }

const handleUserRouter = (req, res) => {
  const method = req.method

  // 登陆
  if (method === 'POST' && req.path === '/api/user/login') {
    const { username = '', password = '' } = req.body // POST请求获取数据
    // const { username = '', password = '' } = req.query // get请求获取数据
    const result = userLogin(username, password)
    return result.then(loginData => {
      if (loginData.username) {
        // 操作cookie httpOnly:限制只能服务端进行修改,客户端无法修改(移入app.js中处理)
        // res.setHeader('Set-Cookie', `username=${loginData.username}; path=/; httpOnly; expires=${getCookieExpires()}`)
        req.session.username = loginData.username
        req.session.realname = loginData.realname
        // 同步到redis
        set(req.sessionId, req.session)
        // console.log(req.session)
        return new SuccessModel()
      } else {
        return new ErrorModel('登陆失败')
      }
    })
    // return result ? new SuccessModel(result) : new ErrorModel(result)
  }

  // 登陆验证测试
  if (method === 'GET' && req.path === '/api/user/login-test') {
    if (req.session.username) {
      return Promise.resolve(new SuccessModel())
    }
    return Promise.resolve(new ErrorModel('请先登陆'))
  }
}

module.exports = handleUserRouter