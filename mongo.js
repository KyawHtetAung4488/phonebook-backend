const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]


const url = 
    `mongodb://fullstack:${password}@cluster0-shard-00-00.kowwx.mongodb.net:27017,cluster0-shard-00-01.kowwx.mongodb.net:27017,cluster0-shard-00-02.kowwx.mongodb.net:27017/phonebook?ssl=true&replicaSet=atlas-ey3s2t-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3){
    Person.find({}).then(result => {
        result.forEach(person => console.log(person))
        process.exit(1)
    })
}

const person = new Person({
    name: name,
    number: number,
})

person.save().then(result => {
    console.log(`${name} saved to database`);
    mongoose.connection.close()
})
