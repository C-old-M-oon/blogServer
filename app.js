const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 设置cookie过期时间为1天
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 *1000))
  return d.toGMTString()
}

// session数据
const SESSION_DATA = {}

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
  // 解析cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return
    }
    const arr = item.split('=')
    const key = arr[0] && arr[0].trim()
    const val = arr[1] && arr[1].trim()
    req.cookie[key] = val
  })

  // 解析session
  let needSetCookie = false
  let userId = req.cookie.userid
  if (userId) {
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {}
    }
    req.session = SESSION_DATA[userId]
  } else {
    needSetCookie = true
    userId = `${(new Date().getTime())}_${Math.random()}`
    SESSION_DATA[userId] = {}
  }
  req.session = SESSION_DATA[userId]

  // 处理post data
  getPostData(req).then(postData => {
    req.body = postData
    // 处理路由
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) {
          // 操作cookie httpOnly:限制只能服务端进行修改,客户端无法修改
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
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
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
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
