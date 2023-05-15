require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const morganBody = require('morgan-body')
// const mongoose = require('mongoose')
const Note = require('./models/note')

morganBody(app)

morgan.token('postData', (req) => req.method === 'POST' && JSON.stringify(req.body))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status - :response-time ms :postData'))

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

app.get('/api/persons', (request, response) => {
    console.log("get");
    Note.find({}).then(persons => {
        response.json(persons)
        console.log(persons);
    })
})

app.get('/api/persons/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note)
    })
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

    console.log("body");

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        name: body.name,
        number: body.number,
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})