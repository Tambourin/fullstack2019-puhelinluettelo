const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const port = 3001;
let contacts = [
  {
    name: "Jukka",
    number: 050505050,
    id: 1
  },
  {
    name: "Pekka",
    number: 324424424242,
    id: 2
  },
  {
    name: "Heidi",
    number: 0501616161,
    id: 3
  }
]

app.get('/info', (request, response) => {
  response.send(`<p>phonebook has info for ${contacts.length} people</p>
      <p>${new Date()}</p>`);
})

app.get('/api/persons/:id', (request, response) => {
  let id = Number(request.params.id);
  let contact = contacts.find(contact => contact.id === id);
  if(contact) {
    response.send(contact);
  } else {
    response.status(404).end();
  }  
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  contacts = contacts.filter(contact => contact.id !== id);
  response.status(204).end();
})

app.post('/api/persons', (request, response) => {
  
  if(!request.body.name) {
    return response.status(400).json({ error: "name missing" });
  } else if(!request.body.number) {
    return response.status(400).json({ error: "number missing" });
  } else if(contacts.find(contact => contact.name === request.body.name)) {
    return response.status(400).json({ error: "Name is already in use"});
  }
  
  
  
  const contact = {
    name: request.body.name,
    number: request.body.number,
    id: Math.floor(Math.random() * 999999)
  } 

  contacts = contacts.concat(contact);
  console.log('contacts: ', contacts);
    
  
  response.json(request.body);
  
  
})

app.listen(port);