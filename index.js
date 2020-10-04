require('dotenv').config()
const express = require('express')
const app = express()

const Person = require('./models/person')
var morgan = require('morgan')
const cors = require('cors')

app.use(express.json())

app.use(cors())

app.use(express.static('build'))
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] :data - :response-time ms'))


// get all persons
app.get('/api/persons', (req, res) => {
    Person.find({}).then(person => {
      res.json(person)
    })
})

// get phone-book info
app.get('/api/info', (req, res) => {
    const numOfPeople = persons.length
    const date = new Date()

    res.send(`<p>Phone book has info for ${numOfPeople} people <br/> <br/> ${date}</p>`)
})

// get person info
app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
      .then(person => {
        res.json(person)
      })
      .catch(error => next(error))
})

// delete person data
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
      .then(result => {
        res.status(204).end()
      })
      .catch(error => next(error))
})

// create person
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if(!body.name){
    res.status(404).end()
  }
  if(!body.number){
    res.status(404).end()
  }

  const person = new Person({
    name: body.name,
    number: body.number || ""
  })

  person.save()
    .then(savedPerson => {
      console.log(`${savedPerson.name} saved to MongoDB`)
      res.json(savedPerson)
    })
    .catch(error=> next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.log(error.message)
  if(error.name === 'CastError'){
    return res.status(400).send({ error: 'malformatted id'})
  }
  else if(error.name === 'ValidationError'){
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})