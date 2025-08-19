import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'

// Test para el ejercicio 5.16
test('form calls event handler with correct details when new blog is created', async () => {
  const createBlog = vi.fn()
  const user_event = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  // Encontrar los campos de entrada
  const titleInput = screen.getByPlaceholderText('write blog title here')
  const authorInput = screen.getByPlaceholderText('write author name here')
  const urlInput = screen.getByPlaceholderText('write blog url here')
  const createButton = screen.getByText('create')

  // Llenar el formulario
  await user_event.type(titleInput, 'Testing React components')
  await user_event.type(authorInput, 'John Doe')
  await user_event.type(urlInput, 'https://example.com/testing-react')

  // Enviar el formulario
  await user_event.click(createButton)

  // Verificar que el controlador de eventos se llamó
  expect(createBlog).toHaveBeenCalledTimes(1)

  // Verificar que se llamó con los datos correctos
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Testing React components',
    author: 'John Doe',
    url: 'https://example.com/testing-react'
  })
})

// Test adicional para verificar que los campos se limpian después del envío
test('form fields are cleared after submission', async () => {
  const createBlog = vi.fn()
  const user_event = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('write blog title here')
  const authorInput = screen.getByPlaceholderText('write author name here')
  const urlInput = screen.getByPlaceholderText('write blog url here')
  const createButton = screen.getByText('create')

  // Llenar el formulario
  await user_event.type(titleInput, 'Test Title')
  await user_event.type(authorInput, 'Test Author')
  await user_event.type(urlInput, 'https://test.com')

  // Verificar que los campos tienen valores
  expect(titleInput.value).toBe('Test Title')
  expect(authorInput.value).toBe('Test Author')
  expect(urlInput.value).toBe('https://test.com')

  // Enviar el formulario
  await user_event.click(createButton)

  // Verificar que los campos se limpiaron
  expect(titleInput.value).toBe('')
  expect(authorInput.value).toBe('')
  expect(urlInput.value).toBe('')
})