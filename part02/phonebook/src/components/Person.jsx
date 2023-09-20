const Person = ({ person, onDelete }) => {

  return (
    <div>
      <p>{person.name} {person.number} <button onClick={() => onDelete(person)}>delete</button></p>
    </div>
  )
}

export default Person