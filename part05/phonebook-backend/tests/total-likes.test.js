const listHelper = require('../utils/list_helper')


describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listHelper.listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(listHelper.listWithoutBlogs)
    expect(result).toBe(0)
  })

  test('of a big list is calculated rigth', () => {
    const result = listHelper.totalLikes(listHelper.blogs)
    expect(result).toBe(46)
  })
})

describe('favoritoBlog', () => {
  test('returns the most liked', () => {
    const result = listHelper.favoritoBlog(listHelper.blogs)
    expect(result).toEqual({
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
      user: "6523bde04556ea3cf0dc3d58"
    })
  })

  test('returns null for an empty list', () => {
    const result = listHelper.favoritoBlog(listHelper.listWithoutBlogs)
    expect(result).toBeNull()
  })

  test('returns the only blog for a list of a single blog', () => {
    const result = listHelper.favoritoBlog(listHelper.listWithOneBlog)
    expect(result).toEqual({
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
      user: "6523bde04556ea3cf0dc3d56"
    })
  })
})

describe('mostBlogs', () => {
  test('returns the author with the most blogs and their count', () => {
    const result = listHelper.mostBlogs(listHelper.blogs)
    expect(result).toEqual({
      author: "Robert C. Martin",
      blogs: 3
    })
  })

  test('returns null for an empty list', () => {
    const result = listHelper.mostBlogs(listHelper.listWithoutBlogs)
    expect(result).toBeNull()
  })

  test('returns the only author and their count for a list of a single blog', () => {
    const result = listHelper.mostBlogs(listHelper.listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1
    })
  })

  test('returns the author with the most blogs and their count', () => {
    const result = listHelper.mostBlogs(listHelper.blogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('mostLikes', () => {
  test('returns the author with the most likes and their total likes count', () => {
    const result = listHelper.mostLikes(listHelper.blogs)
    expect(result).toEqual({
      author: "Michael Chan",
      likes: 17,
    })
  })

  test('returns null for an empty list', () => {
    const result = listHelper.mostLikes(listHelper.listWithoutBlogs)
    expect(result).toBeNull()
  })

  test('returns the author with the most likes for a list of a single blog', () => {
    const result = listHelper.mostLikes(listHelper.listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5,
    })
  })
})