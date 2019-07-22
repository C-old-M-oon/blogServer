const mysql = require('mysql')

// 创建链接对象
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'blogserver'
})

// 开始链接
con.connect()

// 执行查询语句
const sql = 'select * from blogs'
con.query(sql, (err, result) => {
  if (err) {
    console.log(err)
    return
  }
  console.log(result)
})

// 关闭链接
con.end()