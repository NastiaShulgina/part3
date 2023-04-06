const express = require('express')
const app = express()

app.use(express.json())

let notes = [
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

app.get('/', (_request, response) => {
    response.send('<h1>Phonebook backend</h1>')
})

app.get('/api/persons', (_request, response) => {
    response.json(notes)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)

    note ? response.json(note) : response.status(404).end()
})

app.get('/info', (_request, response) => {
    const entriesCounter = (notes.length)
    response.send(`
    <div>Phonebook has info for ${entriesCounter} people</div>
    <div>${new Date()}</div>
    `)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).json(notes)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    } if (notes.some(note => note.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const note = {
        id: Math.floor(Math.random() * 100000),
        name: body.name,
        number: body.number
    }

    notes = notes.concat(note)
    response.json(note)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})