const { userLogin } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleUserRouter = (req, res) => {
  const method = req.method

  // 登陆
  if (method === 'POST' && req.path === '/api/user/login') {
    const { username = '', password = '' } = req.body
    const result = userLogin(username, password)
    return result.then(loginData => {
      if (loginData.username) {
        return new SuccessModel()
      } else {
        return new ErrorModel('登陆失败')
      }
    })
    // return result ? new SuccessModel(result) : new ErrorModel(result)
  }
}

module.exports = handleUserRouter