import { useEffect, useState } from "react";
import countries from "../services/countries";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

function Country({ data }) {
  const [weather, setWeather] = useState(null);
  const lat = data.capitalInfo.latlng[0];
  const lon = data.capitalInfo.latlng[1];

  useEffect(() => {
    countries
      .getWeather(lat, lon, API_KEY)
      .then((data) => {
        setWeather(data);
      })
      .catch((err) => console.log(err));
  }, [lat, lon]);

  if (!weather) return <p>Loading data...</p>;

  const temp = `${(weather.main.temp - 273).toFixed(2)} Celsius`;
  const icon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
  const description = weather.weather.description;
  const wind = weather.wind.speed;

  return (
    <div>
      <h1>{data.name.common}</h1>
      <p>capital {data.capital[0]}</p>
      <p>area {data.area}</p>
      <h2>languages:</h2>
      <ul>
        {Object.values(data.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={data.flags.svg} alt={data.flag.alt} width={128} />

      {weather && (
        <section>
          <h2>Weather in {data.capital[0]}</h2>
          <p>temperature {temp}</p>
          <img src={icon} alt={description} />
          <p>wind {wind} m/s</p>
        </section>
      )}
    </div>
  );
}

export default Country;
