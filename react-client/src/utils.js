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

export function formatDateIfDate(value) {
    // Check if the value is a Date object
    if (value instanceof Date && !isNaN(value.getTime())) {
      return formatToMMDDYYYY(value);
    }
    
    // Check if the value is an ISO 8601 date string
    if (typeof value === 'string' && isISO8601DateString(value)) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return formatToMMDDYYYY(date);
      }
    }
    
    // If the value is not a Date, return it as is
    return value;
  }
  
  // Helper function to format Date object to mm/dd/yyyy
  function formatToMMDDYYYY(date) {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
  
  // Helper function to check if a string is an ISO 8601 date string
  function isISO8601DateString(value) {
    // Regular expression to test for ISO 8601 date strings
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    return iso8601Regex.test(value);
  }
 
  