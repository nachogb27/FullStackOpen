import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      id: '5a437a9e514ab7f168ddf138'
    }
  }

  const user = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  }

  const mockHandler = vi.fn()

  render(
    <Blog 
      blog={blog} 
      updateBlog={mockHandler}
      removeBlog={mockHandler}
      user={user}
    />
  )

  const element = screen.getByText('React patterns Michael Chan')
  expect(element).toBeDefined()
})

// Test específico para el ejercicio 5.13
test('renders title and author but not url or likes by default', () => {
  const blog = {
    id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      id: '5a437a9e514ab7f168ddf138'
    }
  }

  const user = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  }

  const mockUpdateBlog = vi.fn()
  const mockRemoveBlog = vi.fn()

  render(
    <Blog 
      blog={blog} 
      updateBlog={mockUpdateBlog}
      removeBlog={mockRemoveBlog}
      user={user}
    />
  )

  // Verificar que el título y autor están visibles
  const titleAuthorElement = screen.getByText('React patterns Michael Chan')
  expect(titleAuthorElement).toBeDefined()

  // Verificar que el contenedor de detalles está oculto
  const blogDetails = screen.getByTestId('blog-details')
  expect(blogDetails).toHaveStyle('display: none')

  // Verificar que el botón "view" está visible
  const viewButton = screen.getByText('view')
  expect(viewButton).toBeDefined()
})

test('does not render url or likes by default', () => {
  const blog = {
    id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      id: '5a437a9e514ab7f168ddf138'
    }
  }

  const user = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  }

  const mockHandler = vi.fn()

  render(
    <Blog 
      blog={blog} 
      updateBlog={mockHandler}
      removeBlog={mockHandler}
      user={user}
    />
  )

  // Verificar que el título y autor están visibles
  const titleAuthor = screen.getByText('React patterns Michael Chan')
  expect(titleAuthor).toBeDefined()

  // Verificar que los detalles están ocultos por defecto usando el contenedor
  const detailsDiv = screen.getByTestId('blog-details')
  expect(detailsDiv).toHaveStyle('display: none')
})

// Test para el ejercicio 5.14
test('shows url and likes when view button is clicked', async () => {
  const blog = {
    id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      id: '5a437a9e514ab7f168ddf138'
    }
  }

  const user = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  }

  const mockUpdateBlog = vi.fn()
  const mockRemoveBlog = vi.fn()

  render(
    <Blog 
      blog={blog} 
      updateBlog={mockUpdateBlog}
      removeBlog={mockRemoveBlog}
      user={user}
    />
  )

  const user_event = userEvent.setup()

  // Verificar que inicialmente el contenedor de detalles está oculto
  const blogDetails = screen.getByTestId('blog-details')
  expect(blogDetails).toHaveStyle('display: none')

  // Hacer clic en el botón "view"
  const viewButton = screen.getByText('view')
  await user_event.click(viewButton)

  // Verificar que ahora el contenedor de detalles NO tiene display: none
  expect(blogDetails).not.toHaveStyle('display: none')

  // Verificar que la URL y likes están ahora visibles
  expect(screen.getByText('https://reactpatterns.com/')).toBeDefined()
  expect(screen.getByText('likes 7')).toBeDefined()

  // Verificar que el botón "hide" ahora está visible
  expect(screen.getByText('hide')).toBeDefined()
})

// Test para el ejercicio 5.15
test('like button calls event handler twice when clicked twice', async () => {
  const blog = {
    id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      id: '5a437a9e514ab7f168ddf138'
    }
  }

  const user = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  }

  const mockUpdateBlog = vi.fn()
  const mockRemoveBlog = vi.fn()

  render(
    <Blog 
      blog={blog} 
      updateBlog={mockUpdateBlog}
      removeBlog={mockRemoveBlog}
      user={user}
    />
  )

  const user_event = userEvent.setup()

  // Primero necesitamos hacer visible el botón "like" haciendo clic en "view"
  const viewButton = screen.getByText('view')
  await user_event.click(viewButton)

  // Ahora el botón "like" debería estar visible
  const likeButton = screen.getByText('like')

  // Hacer clic en el botón "like" dos veces
  await user_event.click(likeButton)
  await user_event.click(likeButton)

  // Verificar que el controlador de eventos se llamó exactamente dos veces
  expect(mockUpdateBlog).toHaveBeenCalledTimes(2)

  // Opcionalmente, también podemos verificar que se llamó con el blog correcto
  expect(mockUpdateBlog).toHaveBeenCalledWith(blog)
})