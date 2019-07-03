const http = require('http')
const querystring = require('querystring')

const serverHandle = require('../app')

const server = http.createServer((req, res) => {
  serverHandle(req, res)
})

server.listen(8000)
