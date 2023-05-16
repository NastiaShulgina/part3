const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://anastasiiashulhina:${password}@fullstack.c8ng0r1.mongodb.net/notebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Note = mongoose.model('Note', noteSchema)

if (process.argv.length === 3) {
  Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const note = new Note({
    name: process.argv[3],
    number: process.argv[4],
  })
  note.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to the notebook!`)
    mongoose.connection.close()
  })
}