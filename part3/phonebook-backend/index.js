const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

// Middleware para parsear JSON
app.use(express.json())

// Middleware de CORS
app.use(cors())

// Middleware de logging
app.use(morgan('tiny'))

// Servir archivos estáticos del frontend
app.use(express.static('dist'))

// Datos hardcodeados
let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// Ruta para obtener todas las personas
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// Ruta para mostrar información
app.get('/info', (request, response) => {
  const totalPersons = persons.length
  const currentTime = new Date()
  
  const infoHtml = `
    <div>
      <p>Phonebook has info for ${totalPersons} people</p>
      <p>${currentTime}</p>
    </div>
  `
  
  response.send(infoHtml)
})

// Ruta para obtener una persona específica por ID
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// Ruta para eliminar una persona por ID
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  
  response.status(204).end()
})

// Función para generar un ID único con Math.random()
const generateId = () => {
  return Math.floor(Math.random() * 1000000)
}

// Ruta para crear una nueva persona
app.post('/api/persons', (request, response) => {
  const body = request.body

  // Validar que el nombre y número están presentes
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  // Validar que el nombre no existe ya
  const existingPerson = persons.find(person => person.name === body.name)
  if (existingPerson) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})