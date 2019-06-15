const mongoose = require('mongoose');

if (process.argv.length < 2) {
  console.log('password not given');
  process.exit(1);
}
const password = process.argv[2];

const url = 
  `mongodb+srv://tambourin:${password}@cluster0-hnkbp.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

console.log('pituus:', process.argv.length);
const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach(result => {
      console.log(`${result.name} ${result.number}`);
    })
    mongoose.connection.close();
  })
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  
  person.save().then(response => {
    console.log(response);
    mongoose.connection.close();
  }).catch();
}



