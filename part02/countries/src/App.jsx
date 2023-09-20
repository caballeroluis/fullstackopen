import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])
  const [countryDetails, setCountryDetails] = useState(null)

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        setCountries(response.data)
      })
      .catch((error) => {
        console.error('Error fetching countries:', error)
      })
  }, [])

  useEffect(() => {
    if (filter === '') {
      setFilteredCountries([])
    } else {
      const filtered = countries.filter((country) =>
        country.name.common.toLowerCase().includes(filter.toLowerCase())
      )
      setFilteredCountries(filtered)
      setCountryDetails(null)
    }
  }, [filter, countries])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const renderCountryDetails = (country) => {
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>capital {country.capital}</p>
        <p>area {country.area}</p>
        <h4>languages</h4>
        <ul>
          {Object.values(country.languages).map((language, index) => (
            <li key={index}>{language}</li>
          ))}
        </ul>
        <img
          src={country.flags.png}
          alt={`Flag of ${country.name.common}`}
          border="1px solid gray"
        />
      </div>
    )
  }

  const handleShowDetails = (country) => {
    setCountryDetails(country)
  }

  return (
    <div>
      <div>
        <label htmlFor="search">Search: </label>
        <input
          type="text"
          id="search"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>
      <div>
        {filteredCountries.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : countryDetails ? (
          renderCountryDetails(countryDetails)
        ) : (
          <ul>
            {filteredCountries.map((country) => (
              <li key={country.name.common}>
                {country.name.common}
                <button onClick={() => handleShowDetails(country)}>show</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
