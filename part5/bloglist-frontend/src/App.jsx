import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })
  
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  const handleLogin = async (loginObject) => {
    try {
      const user = await loginService.login(loginObject)
      
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      showNotification('Wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const removeBlog = async (blog) => {
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      showNotification(
        `Blog ${blog.title} by ${blog.author} removed`,
        'success'
      )
    } catch (exception) {
      showNotification('Failed to remove blog', 'error')
    }
  }

  const addLike = async (blog) => {
    try {
      const updatedBlog = await blogService.like(blog)
      setBlogs(blogs.map(b => b.id !== blog.id ? b : updatedBlog))
    } catch (exception) {
      showNotification('Failed to update blog', 'error')
    }
  }
  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      showNotification(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        'success'
      )
    } catch (exception) {
      showNotification('Failed to add blog', 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={notification.message} type={notification.type} />
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      
      <h2>blogs</h2>
      <p>
        {user.name} logged in 
        <button onClick={handleLogout}>logout</button>
      </p>
      
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog 
            key={blog.id} 
            blog={blog} 
            updateBlog={addLike}
            removeBlog={removeBlog}
            user={user}
          />
        )}
    </div>
  )
}

export default App