const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const Person = require('./models/person');
const errorHandler = require('./middleware/errorHandler');

app.use(express.json());
app.use(morgan('tiny'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));
app.use(express.json());
app.use(cors());
app.use(express.static('dist'))

morgan.token('postData', (req, res) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    return JSON.stringify(req.body);
  } else {
    return '';
  }
});


app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons);
    })
    .catch(error => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).json({ error: 'Person not found' });
      }
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name or number missing' });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number
  });

  newPerson
    .save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error));
});

app.patch('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name or number missing' });
  }

  Person.findByIdAndUpdate(body.id, { name: body.name, number: body.number }, { new: true })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).json({ error: 'Person not found' });
      }
    })
    .catch(error => next(error));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
