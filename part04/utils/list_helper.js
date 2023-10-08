const _ = require('lodash')
const User = require('../models/User')

const dummy = (blogs) => {
  return 1
}

const listWithoutBlogs = []

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fd",
    title: "React vs Angular vs Vue",
    author: "Michael Chan",
    url: "http://blog.cleancoder.com/uncle-bob/2016/06/26/ReactAngularAndVue.html",
    likes: 10,
    __v: 0
  }
]

const users = [
  {
    username: 'User_1',
    name: 'User 1 name',
    password: '$2b$10$qAUEpsqoo6047bzyC78jYumGAf8ihTNo6gJCOwYhhH6TRBU1Q9XTS',
    blogs: [
      '5a422a851b54a676234d17f7',
      '5a422aa71b54a676234d17f8',
    ],
  },
  {
    username: 'User_2',
    name: 'User 2 name',
    password: '$2b$10$DNDmt3RAETTJ8zfY1S0kpeGL/n060X5P6W71cX2Tvx.j4p8AT0mHm',
    blogs: [
      '5a422b3a1b54a676234d17f9',
      '5a422b891b54a676234d17fa',
    ],
  },
  {
    username: 'root',
    name: 'Superuser',
    password: '$2b$10$m4LTheih2SwhcKprjA9ir.Zg1vSr7wolx0QSoffZWBDEe3DCQ/SY2',
    blogs: [
      '5a422a851b54a676234d17f7',
      '5a422aa71b54a676234d17f8',
    ],
  },
]

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

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorLikes = blogs.reduce((likesMap, blog) => {
    const author = blog.author
    const likes = blog.likes

    if (!likesMap[author]) {
      likesMap[author] = 0
    }

    likesMap[author] += likes
    return likesMap
  }, {})

  const mostLikedAuthor = Object.keys(authorLikes).reduce((mostLiked, author) => {
    if (!mostLiked || authorLikes[author] > authorLikes[mostLiked]) {
      return author
    }
    return mostLiked
  }, null)

  return {
    author: mostLikedAuthor,
    likes: authorLikes[mostLikedAuthor],
  }
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  dummy,
  totalLikes,
  favoritoBlog,
  mostBlogs,
  mostLikes,
  listWithoutBlogs,
  listWithOneBlog,
  blogs,
  usersInDb,
  users,
}