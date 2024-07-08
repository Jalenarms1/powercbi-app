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

export const put = (endpoint, body) => {
    // '/job/toggle-active'
    return axios.put(`${ROOT_API_URL}${endpoint}`, body, {headers: {Authorization: `Bearer ${ getToken()}`}})
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
    if (`${value}`.trim() == 'null' || `${value}`.trim() == 'undefined') return '(blank)'
    
    return `${value}`;
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
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    return iso8601Regex.test(value);
  }

  export function getNextOccurrence(frequency, day, time) {
    const [hour, period] = time.split(' ');
    let hour24 = parseInt(hour);
  
    if (period.toUpperCase() === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period.toUpperCase() === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
  
    const now = new Date();
  
    if (frequency === 'weekly') {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const targetDayIndex = daysOfWeek.indexOf(day);
      if (targetDayIndex === -1) throw new Error('Invalid day of the week');
  
      const currentDayIndex = now.getDay();
      let daysUntilNext = targetDayIndex - currentDayIndex;
      if (daysUntilNext <= 0) {
        daysUntilNext += 7;
      }
  
      const nextDate = new Date(now);
      nextDate.setDate(now.getDate() + daysUntilNext);
      nextDate.setHours(hour24, 0, 0, 0); // Set the time to the specified hour, minute, second, and millisecond
  
      return `${formatToMMDDYYYY(nextDate)} ${formatTo12Hour(nextDate)}`;
    } else if (frequency === 'monthly') {
      const targetDay = parseInt(day, 10);
      if (isNaN(targetDay) || targetDay < 1 || targetDay > 31) throw new Error('Invalid day of the month');
  
      let nextDate = new Date(now.getFullYear(), now.getMonth(), targetDay, hour24, 0, 0, 0);
  
      if (nextDate <= now) {
        nextDate = new Date(now.getFullYear(), now.getMonth() + 1, targetDay, hour24, 0, 0, 0);
      }
  
      return `${formatToMMDDYYYY(nextDate)} ${formatTo12Hour(nextDate)}`;
    } else {
      throw new Error('Invalid frequency');
    }
  }
  
// Helper function to format Date object to mm/dd/yyyy

  
  // Helper function to format Date object to h:mm AM/PM
function formatTo12Hour(date) {
let hours = date.getHours();
const minutes = date.getMinutes().toString().padStart(2, '0');
const ampm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12;
hours = hours ? hours : 12; // The hour '0' should be '12'
return `${hours}:${minutes} ${ampm}`;
}

export const getTomorrowDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0]; // Format date to yyyy-mm-dd
  };


export const getFilterColsFromStr = (colStr) => {
    const filterObj = []
    colStr.split("|").forEach(c => {
        const split = c.split("=")
        const obj = {}
        obj.name = split[0]
        obj.values = [...split[1].split(",").map(v => `${v}` == '' ? '(blank)' : v)]
        filterObj.push(obj)
    })

    return filterObj
}

export const getSortsFromStr = (sortStr) => {
    const sortList = []
    sortStr.split("|").forEach(c => {
        const split = c.split("=")
        const obj = {}
        obj.name = split[0]
        obj.sort = split[1]
        sortList.push(obj)
    })

    return sortList
}

export const getSortListStr = (arr) => {
  let sortlistArr = []
  arr.forEach(s => {
    let sortStr = `${s.name}=${s.sort}`

    sortlistArr.push(sortStr)
        
  })

  return sortlistArr.join("|")
}

export const getFiltersStr = (arr) => {
  let filtersArr = []
  arr.forEach(f => {
    let colStr = `${f.name}=${f.values.join(",")}`

    filtersArr.push(colStr)
  })

  return filtersArr.join("|")
}

export const sortArr = (arr, direction, col) => {
  let cData; 
  
  cData =  [...arr].sort((a, b) => {
    let comparison = 0;
    const valueA = col ? a[col] : a;
    const valueB = col ? b[col] : b;
    // Handle sorting based on data type
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      comparison = valueA - valueB;
    } else if (typeof valueA === 'string' && typeof valueB === 'string') {
      comparison = valueA.localeCompare(valueB);
    } else if (valueA instanceof Date && valueB instanceof Date) {
      comparison = valueA.getTime() - valueB.getTime();
    } else {
      // Handle other data types or mixed types as needed
      comparison = String(valueA).localeCompare(String(valueB));
    }

    // Adjust comparison based on sort direction
    return direction === 'asc' ? comparison : -comparison;
  });

  return cData
}
