const getBlogList = (author, keyword) => {
  return [
    {
      id: 1,
      title: '标题1',
      content: '内容1',
      createTime: new Date(),
      author: 'leez'
    },{
      id: 2,
      title: '标题2',
      content: '内容2',
      createTime: new Date(),
      author: 'leez'
    }
  ]
}

getBlogDetail = (id) => {
  return {
    id: 1,
    title: '标题1',
    content: '内容1',
    createTime: new Date(),
    author: 'leez'
  }
}

addBlog = (blogData = {}) => {
  return {
    id: 3,
    title: blogData.title,
    content: blogData.content
  }
}

updateBlog = (id, blogData = {}) => {
  return true
}

deleteBlog = (id) => {
  return true
}

module.exports = {
  getBlogList,
  getBlogDetail,
  addBlog,
  updateBlog,
  deleteBlog
}
