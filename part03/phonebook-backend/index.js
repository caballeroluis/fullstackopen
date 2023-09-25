const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const Person = require('./models/person');

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


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  });
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).json({ error: 'Person not found' });
      }
    })
    .catch(error => {
      console.log(error);
      response.status(500).json({ error: 'Internal Server Error' });
    });
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => {
      console.log(error);
      response.status(500).json({ error: 'Internal Server Error' });
    });
});

app.post('/api/persons', (request, response) => {
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
    .catch(error => {
      console.log(error);
      response.status(500).json({ error: 'Internal Server Error' });
    });
});

app.patch('/api/persons', (request, response) => {
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
    .catch(error => {
      console.log(error);
      response.status(500).json({ error: 'Internal Server Error' });
    });
});

app.get('/info', (request, response) => {
  Person.countDocuments({}, (error, personCount) => {
    if (error) {
      console.log(error);
      response.status(500).json({ error: 'Internal Server Error' });
    } else {
      const currentTime = new Date();
      const responseText = `
        <p>Phonebook has info for ${personCount} people</p>
        <p>${currentTime.toString()}</p>
      `;
      response.send(responseText);
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
