const Countries = ({ filteredCountries, onCountryClick }) => {
  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  return (
    <ul>
      {filteredCountries.map((country) => (
        <li key={country.name.common}>
          {country.name.common}
          <button onClick={() => onCountryClick(country)}>Show</button>
        </li>
      ))}
    </ul>
  )
}

export default Countries
