const express = require('express');
const app = express();

app.use(express.json());

const persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (!person) {
    return res.status(404).json({ error: 'Person not found' });
  }

  res.json(person);
});

app.get('/info', (req, res) => {
  const currentTime = new Date();
  const personCount = persons.length;
  
  const responseText = `
    <p>Phonebook has info for ${personCount} people</p>
    <p>${currentTime.toString()}</p>
  `;

  res.send(responseText);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
