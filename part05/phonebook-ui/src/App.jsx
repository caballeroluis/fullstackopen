import React, { useState, useEffect } from 'react'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import Persons from './components/Persons.jsx'
import Notification from './components/Notification.jsx'
import PersonService from './services/PersonService.jsx'
import LoginService from './services/LoginService.jsx'

const App = () => {
  
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterName, setFilterName ] = useState('')
  const [ notificationMessage, setNotificationMessage ] = useState('')
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ user, setUser ] = useState(null)
  
  function getAllPersons() {
    PersonService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
  
    const existingPerson = persons.find((person) => person.name === newName)
  
    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `"${newName}" is already in the phonebook, replace the old number with a new one?`
      )
  
      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber }
  
        PersonService.update(existingPerson, updatedPerson)
          .then(() => {
            setPersons(
              persons.map((person) =>
                person.id === updatedPerson.id ? updatedPerson : person
              )
            )
            setNotificationMessage(`Updated "${newName}"`)
            setTimeout(() => {
              setNotificationMessage('')
            }, 3000)
            setNewName('')
            setNewNumber('')
          })
          .catch((error) => {
            setNotificationMessage(`Error updating ${newName}'s number`)
            setTimeout(() => {
              setNotificationMessage('')
            }, 3000)
            console.error(error)
          })
      }
    } else {
      const newPerson = { name: newName, number: newNumber }
      PersonService.create(newPerson).then((response) => {
          setPersons(persons.concat(response))
          setNotificationMessage(`Added "${newName}"`)
          setTimeout(() => {
            setNotificationMessage('')
          }, 3000)
          setNewName('')
          setNewNumber('')
        }).catch((error) => {
          setNotificationMessage(`Error. "${newName}" and "${newNumber}" was not saved. ${error.response.data.error}`)
          setTimeout(() => {
            setNotificationMessage('')
          }, 3000)
          console.log("Error when adding person", error)
        })
      }
  }

  const handleDelete = (person) => {
    const confirmed = window.confirm(`Delete "${person.name}"?`)
    if (confirmed) {
      PersonService.remove(person)
        .then(() => {
          setPersons(persons.filter((_person) => _person.id !== person.id))
          setNotificationMessage(`Deleted "${person.name}"`)
          setTimeout(() => {
            setNotificationMessage('')
          }, 3000)
        })
        .catch((error) => {
          setNotificationMessage(`Error "${person.name}" was not deleted`)
          setTimeout(() => {
            setNotificationMessage('')
          }, 3000)
          console.error(`Error when deleting person "${person.name}"`, error)
        })
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await LoginService.login({
        username, password,
      })
      
      
      setUser(user)
      setUsername('')
      setPassword('')
      setNotificationMessage(`"${user.name}" has been logged in `)
    } catch (exception) {
      throw exception
    }
  }

  const phonebookForm = () => (
    <div>
      <Filter filterName={filterName} handleFilterNameChange={handleFilterNameChange} />
      <h3>Add a New Person</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filterName={filterName} onDelete={handleDelete} />
      {notificationMessage && <Notification notificationMessage={notificationMessage} />}

    </div>    
  )

  const loginForm = () => (
    <div>
      <h3>Log in to application</h3>

      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>    
  )

  return (
    <div>
      <h2>Phonebook</h2>
      {user === null ? loginForm() : phonebookForm()}
    </div>
  )
}

export default App