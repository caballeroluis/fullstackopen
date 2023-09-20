import Person from './Person'

const Persons = ({ persons, filterName }) => {
  const filteredPersonsByName = persons.filter((person) =>
    person.name?.toLowerCase().includes(filterName?.toLowerCase())
  )

  return (
    <ul>
      {filteredPersonsByName.map((person, index) => (
        <li key={index}>
          <Person person={person} />
        </li>
      ))}
    </ul>
  )
}

export default Persons