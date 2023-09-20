import axios from 'axios'

const baseUrl = 'http://localhost:3001'

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

export default { getAll, create, remove }