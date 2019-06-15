const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI;


console.log('Connecting to MongoDB:', url);

mongoose.connect(url, { useNewUrlParser: true })
  .then(result => {
    console.log('Connected');
  }).catch(error => {
    console.log('error:', error);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, unique: true, minlength: 3 },
  number: { type: String, minlength: 8 },
});

personSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Person', personSchema);
  
