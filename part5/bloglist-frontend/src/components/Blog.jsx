import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    updateBlog(blog)
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showRemoveButton = user && blog.user && user.username === blog.user.username

  return (
    <div style={blogStyle} className="blog" data-testid="blog">
      <div className="blog-title-author">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} style={hideWhenVisible} className="view-button">
          view
        </button>
        <button onClick={toggleVisibility} style={showWhenVisible} className="hide-button">
          hide
        </button>
      </div>
      <div style={showWhenVisible} className="blog-details" data-testid="blog-details">
        <div className="blog-url">{blog.url}</div>
        <div className="blog-likes">
          likes {blog.likes} 
          <button onClick={handleLike} className="like-button">like</button>
        </div>
        <div className="blog-user">{blog.user.name}</div>
        {showRemoveButton && (
          <button onClick={handleRemove} style={{ backgroundColor: '#ff6b6b' }} className="remove-button">
            remove
          </button>
        )}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired
  }).isRequired
}

export default Blog