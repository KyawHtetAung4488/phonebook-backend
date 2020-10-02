const { request } = require('express')
const express = require('express')
const app = express()

var morgan = require('morgan')
const cors = require('cors')

app.use(express.json())

app.use(cors())

app.use(express.static('build'))
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] :data - :response-time ms'))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
]

// get all persons
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

// get phone-book info
app.get('/api/info', (req, res) => {
    const numOfPeople = persons.length
    const date = new Date()

    res.send(`<p>Phone book has info for ${numOfPeople} people <br/> <br/> ${date}</p>`)
})

// get person info
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)

    person = persons.find(person => person.id === id )
    if(person){
        res.json(person)
    }
    else{
        res.status(404).end()
    }
})

// delete person data
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id);

    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

// create person
app.post('/api/persons', (req, res) => {
  const body = req.body

  const isExit = persons.find(person => person.name === body.name) 
  console.log(isExit);

  if(!body.name || !body.number){
    res.status(404).json({
      error: 'Name or Number are missing'
    })
  }
  if(isExit){
    res.status(404).json({
      error: 'name must be unique'
    })
  }

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  }

  const person = {
    name: body.name,
    number: body.number || "",
    id: getRandomInt(10000)
  }

  persons = persons.concat(person)
  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})