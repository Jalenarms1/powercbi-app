import axios from "axios"
import { getToken } from "./jwt-helper"

export const ROOT_API_URL = 'http://localhost:3000/api'

export const post = (endpoint, body) => {
    return axios.post(`${ROOT_API_URL}${endpoint}`, body, {headers: {Authorization: `Bearer ${getToken()}`}})
}

export const get = (endpoint) => {
    console.log({Authorization: `Bearer ${getToken()}`});
    return axios.get(`${ROOT_API_URL}${endpoint}`, {headers: {Authorization: `Bearer ${ getToken()}`}})
}