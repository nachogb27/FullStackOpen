const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// Mantener el GET
testingRouter.get('/reset', (request, response) => {
  response.status(200).json({ message: 'Testing endpoint works!' })
})

// Y también el POST
testingRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter