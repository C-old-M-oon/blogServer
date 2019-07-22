const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 处理post数据
const getPostData = (req) => {
  return new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({})
      return
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(JSON.parse(postData))
    })
  })
}

const serverHandle = (req, res) => {
  res.setHeader('Content-type', 'application/json')
  // process.env.NODE_ENV
  // 获取path
  const url = req.url
  req.path = url.split('?')[0]

  // 解析query
  req.query = querystring.parse(url.split('?')[1])
  
  // 处理post data
  getPostData(req).then(postData => {
    req.body = postData
    // 处理路由
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then(blogData => {
        if (blogData) {
          res.end(JSON.stringify(blogData))
        }
      })
      return
    }
    // const blogData = handleBlogRouter(req, res)

    const userResult = handleUserRouter(req, res)
    if (userResult) {
      userResult.then(userData => {
        res.end(JSON.stringify(userData))
      })
      return
    }
    // if (userData) {
    //   res.end(JSON.stringify(userData))
    //   return
    // }

    //未命中路由返回404
    res.writeHead(404, {'Content-type': 'text/plain'})
    res.write('404 not found')
    res.end()

  })
}

module.exports = serverHandle
