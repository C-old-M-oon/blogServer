const { getBlogList, getBlogDetail, addBlog, updateBlog, deleteBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleBlogRouter = (req, res) => {
  const { id } = req.query
  const method = req.method
  // 获取列表
  if (method === 'GET' && req.path === '/api/blog/list') {
    const { author = '', keyword = '' } = req.query
    const listData = getBlogList(author, keyword)
    return new SuccessModel(listData)
  }

  // 获取详情
  if (method === 'GET' && req.path === '/api/blog/detail') {
    const blogDetail = getBlogDetail(id)
    return new SuccessModel(blogDetail)
  }

  // 新增文章
  if (method === 'POST' && req.path === '/api/blog/add') {
    // console.log(req.body)
    const data = addBlog(req.body)
    return new SuccessModel(data)
  }

  // 更新文章
  if (method === 'POST' && req.path === '/api/blog/update') {
    const result = updateBlog(id, req.body)
    return result ? new SuccessModel(result) : new ErrorModel(result)
  }

  // 删除文章
  if (method === 'DELETE' && req.path === '/api/blog/delete') {
    const result = deleteBlog(id)
    return result ? new SuccessModel(result) : new ErrorModel(result)
  }
}

module.exports = handleBlogRouter
