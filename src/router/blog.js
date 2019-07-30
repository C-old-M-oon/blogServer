const { getBlogList, getBlogDetail, addBlog, updateBlog, deleteBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 登陆验证中间件
const loginCheck = (req) => {
  // console.log(req.session)
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel('尚未登陆'))
  }
}

const handleBlogRouter = (req, res) => {
  const { id } = req.query
  const method = req.method
  // 获取列表
  if (method === 'GET' && req.path === '/api/blog/list') {
    const { author = '', keyword = '' } = req.query
    // const listData = getBlogList(author, keyword)
    // return new SuccessModel(listData)
    const result = getBlogList(author, keyword)
    return result.then(listData => {
      return new SuccessModel(listData)
    })
  }

  // 获取详情
  if (method === 'GET' && req.path === '/api/blog/detail') {
    const { id = '' } = req.query
    const result = getBlogDetail(id)
    return result.then(blogDetail => {
      return new SuccessModel(blogDetail)
    })
    // const blogDetail = getBlogDetail(id)
    // return new SuccessModel(blogDetail)
  }

  // 新增文章
  if (method === 'POST' && req.path === '/api/blog/add') {
    // console.log(req.body)
    // const data = addBlog(req.body)
    // return new SuccessModel(data)
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      return loginCheckResult
    }
    const createtime = new Date()
    req.body.author = req.session.username
    req.body.createtime = createtime.getTime()
    const result = addBlog(req.body)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  // 更新文章
  if (method === 'POST' && req.path === '/api/blog/update') {
    // const result = updateBlog(id, req.body)
    // return result ? new SuccessModel(result) : new ErrorModel(result)
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      return loginCheckResult
    }
    const result = updateBlog(id, req.body)
    return result.then(val => {
      if (val) {
        return new SuccessModel()
      } else {
        return new ErrorModel()
      }
    })
  }

  // 删除文章
  if (method === 'DELETE' && req.path === '/api/blog/delete') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      return loginCheckResult
    }
    const author = req.session.username
    const result = deleteBlog(id, author)
    return result.then(val => {
      if (val) {
        return new SuccessModel()
      } else {
        return new ErrorModel()
      }
    })
    // return result ? new SuccessModel(result) : new ErrorModel(result)
  }
}

module.exports = handleBlogRouter
