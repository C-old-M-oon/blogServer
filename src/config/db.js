const env = process.env.NODE_ENV // 环境参数

let MYSQL_CONF = {}

if (env === 'dev') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'myblog'
  }
}

if (env === 'production') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'blogserver'
  }
}

module.exports = { MYSQL_CONF }