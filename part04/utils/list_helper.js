const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.reduce((total, blog) => total + blog.likes, 0)
  return likes
}

module.exports = {
  dummy,
  totalLikes
}