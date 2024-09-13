import axios from "axios";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";
const opwUrl = "https://api.openweathermap.org/data/2.5/weather";

const getAll = () => {
  const request = axios.get(`${baseUrl}/all`);
  return request.then((response) => response.data);
};

const getCountry = (name) => {
  const request = axios.get(`${baseUrl}/name/${name}`);
  return request.then((response) => response.data.name.common);
};

const getWeather = (lat, lon, key) => {
  const request = axios.get(`${opwUrl}?lat=${lat}&lon=${lon}&appid=${key}`);
  return request.then((response) => response.data);
};

export default { getAll, getCountry, getWeather };
