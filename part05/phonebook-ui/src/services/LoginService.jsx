import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/api`;

const login = (person) => {
  const request = axios.post(`${baseUrl}/login`, person)
  return request.then((response) => response.data)
}

export default { login }