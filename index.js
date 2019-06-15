require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('build'));

morgan.token('body-json', (request, response) => {
if (request.method === 'POST') {
    return JSON.stringify(request.body);
  }
  
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body-json'));

PORT = process.env.PORT || 3001;



app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    response.send(`<p>phonebook has info for ${count} people</p>
      <p>${new Date()}</p>`);
  })
  
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons);
  }).catch(error => next(error));
})

app.get('/api/persons/:id', (request, response, next) => {
  let person = Person.findById(request.params.id).then(person => {
    if(person) {
      response.json(person);
    } else {
      response.status(404).end();
    }  
  }).catch(error => next(error))  
})



app.delete('/api/persons/:id', (request, response, next) => {  
  Person.findByIdAndDelete(request.params.id).then(person => {
    response.status(204).end();
  }).catch(error => {
    next(error); 
  });
  
})

app.post('/api/persons', (request, response, next) => {  
  if(!request.body.name) {
    return response.status(400).json({ error: "name missing" });
  } else if(!request.body.number) {
    return response.status(400).json({ error: "number missing" });
  } 
  
  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  }); 

  person.save().then(savedPerson => {
    response.json(savedPerson);
  }).catch(error => {
    next(error);
  });  
})

app.put('/api/persons/:id', (request, response, next) => {
  const person = {
    name: request.body.name,
    number: request.body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true }).then((updatedPerson) => {
    response.json(updatedPerson);
  }).catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error);
  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'id format error' });
  } else if(error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message});
  }
  next(error);
}
app.use(errorHandler);

app.listen(PORT);