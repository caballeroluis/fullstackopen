import React, { useState, useEffect } from 'react'
import Finder from './components/Finder'
import Countries from './components/Countries'
import Country from './components/Country'
import CountryService from './services/CountryService'
import WeatherService from './services/WeatherService'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])
  const [countryDetails, setCountryDetails] = useState(null)
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    CountryService.getCountries()
      .then((data) => setCountries(data))
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

  const handleShowDetails = (country) => {
    setCountryDetails(country)
    fetchWeatherData(country.capital)
  }

  const fetchWeatherData = (capital) => {
    const apiKey = import.meta.env.VITE_REACT_APP_OPENWEATHERMAP_API_KEY
    if (!apiKey) {
      console.error('OpenWeatherMap API key is missing.')
      return
    }

    WeatherService.getWeatherData(capital, apiKey)
      .then((data) => setWeatherData(data))
      .catch((error) => {
        console.error('Error fetching weather data:', error)
      })
  }

  return (
    <div>
      <Finder
        filter={filter}
        onFilterChange={handleFilterChange}
      />
      <div>
        {filteredCountries.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : countryDetails ? (
          <Country country={countryDetails} weatherData={weatherData} />
        ) : (
          <Countries
            filteredCountries={filteredCountries}
            onCountryClick={handleShowDetails}
          />
        )}
      </div>
    </div>
  )
}

export default App
