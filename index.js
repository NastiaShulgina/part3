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

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(cors())
app.use(requestLogger)
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

app.get('/api/persons/:id', (request, response, next) => {
    Note.findById(request.params.id).then(note => {
        response.json(note)
    }).catch(error => next(error))
})

app.get('/info', (_request, response) => {
    const entriesCounter = (notes.length)
    response.send(`
    <div>Phonebook has info for ${entriesCounter} people</div>
    <div>${new Date()}</div>
    `)
})

app.delete('/api/persons/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
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

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})