import Person from './Person'

const Persons = ({ persons, filterName, onDelete }) => {
  const filteredPersonsByName = persons.filter((person) =>
    person.name?.toLowerCase().includes(filterName?.toLowerCase())
  )

  return (
    <div>
      {filteredPersonsByName.map((person, index) => (
        <Person person={person} onDelete={onDelete} key={index} />
      ))}
    </div>
  )
}

export default Persons