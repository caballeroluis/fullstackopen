const mongoose = require('mongoose');

const password = process.argv[2];
require('dotenv').config();

const url = `mongodb+srv://${process.env.USERNAME}:${password}@${process.env.MONGO_DB_CLUSTER}/?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', phonebookSchema);

if (process.argv.length === 3) {
  Person.find({}).then((persons) => {
    console.log('phonebook:');
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name,
    number,
  });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log('Invalid number of arguments. Usage: node mongo.js <password> [<name> <number>]');
  mongoose.connection.close();
}
