import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/api`;

const getAll = () => {
  const request = axios.get(`${baseUrl}/persons`)
  return request.then((response) => response.data)
}

const create = (newPerson) => {
  const request = axios.post(`${baseUrl}/persons`, newPerson)
  return request.then((response) => response.data)
}

const remove = (person) => {
  return axios.delete(`${baseUrl}/persons/${person.id}`)
}

const update = (person) => {
  const request = axios.patch(`${baseUrl}/persons`, person)
  return request.then((response) => response.data)
}

export default { getAll, create, remove, update }