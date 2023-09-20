import axios from 'axios'

const getWeatherData = (capital, apiKey) => {
  return axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`
    )
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching weather data:', error)
      throw error
    })
}

export default {
  getWeatherData,
}
