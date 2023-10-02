const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.reduce((total, blog) => total + blog.likes, 0)
  return likes
}

const favoritoBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorito, blog) =>
    blog.likes > favorito.likes ? blog : favorito
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorCounts = _.countBy(blogs, 'author')

  const authorWithMostBlogs = _.maxBy(Object.keys(authorCounts), (author) => authorCounts[author])

  return {
    author: authorWithMostBlogs,
    blogs: authorCounts[authorWithMostBlogs],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoritoBlog,
  mostBlogs,
}