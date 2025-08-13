const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const config = require('../utils/config')

// Usar un secret fijo para tests si no está definido
const SECRET = config.SECRET || 'testsecret123'

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // Crear un usuario de prueba
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Root User', passwordHash })
  await user.save()

  // Crear token para el usuario
  const userForToken = {
    username: user.username,
    id: user._id,
  }
  token = jwt.sign(userForToken, SECRET)

  // Crear blogs asociados al usuario
  const blogObjects = helper.initialBlogs.map(blog => new Blog({
    ...blog,
    user: user._id
  }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

  // Actualizar la lista de blogs del usuario
  user.blogs = blogObjects.map(blog => blog._id)
  await user.save()
}, 10000) // Aumentar timeout a 10 segundos

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 10000)

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  }, 10000)

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)
    expect(titles).toContain('React patterns')
  }, 10000)

  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
      expect(blog._id).toBeUndefined()
    })
  })

  test('blogs contain user information', async () => {
    const response = await api.get('/api/blogs')
    
    response.body.forEach(blog => {
      expect(blog.user).toBeDefined()
      expect(blog.user.username).toBeDefined()
      expect(blog.user.name).toBeDefined()
    })
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Mozilla Developer Network',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
      likes: 15
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain('async/await simplifies making async calls')
  })

  test('increases the total number of blogs in database by one', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: 'Test driven development',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2014/12/17/TheCyclesOfTDD.html',
      likes: 9
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
  })

  test('fails with status code 401 if token is not provided', async () => {
    const newBlog = {
      title: 'Test without token',
      author: 'Test Author',
      url: 'http://example.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid and user is the creator', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('fails with status code 401 if token is not provided', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test('fails with status code 403 if user is not the creator', async () => {
    // Crear otro usuario
    const passwordHash = await bcrypt.hash('another', 10)
    const anotherUser = new User({ username: 'another', name: 'Another User', passwordHash })
    await anotherUser.save()

    // Crear token para el otro usuario
    const userForToken = {
      username: anotherUser.username,
      id: anotherUser._id,
    }
    const anotherToken = jwt.sign(userForToken, SECRET)

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${anotherToken}`)
      .expect(403)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})