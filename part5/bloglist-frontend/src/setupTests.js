import '@testing-library/jest-dom'

// Configuración global para los tests
global.matchMedia = global.matchMedia || function (query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: function () {},
    removeListener: function () {},
    addEventListener: function () {},
    removeEventListener: function () {},
    dispatchEvent: function () {},
  }
}

// Mock de window.confirm para los tests
global.confirm = () => true

// Configuración de console para tests más limpios
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})