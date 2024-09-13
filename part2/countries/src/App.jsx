import { useEffect } from "react";
import { useState } from "react";
import countries from "./services/countries";
import Country from "./components/country";
import Countries from "./components/countries";

function App() {
  const [query, setQuery] = useState("");
  const [allCountries, setAllCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    countries
      .getAll()
      .then((data) => {
        setAllCountries(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleClick = (country) => {
    setSelectedCountry(country);
  };

  const countriesToShow = query
    ? allCountries.filter((data) =>
        data.name.common.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div>
      <p>
        find countries <input onChange={handleChange} type="text" />
      </p>
      {countriesToShow.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : countriesToShow.length === 1 ? (
        <Country data={countriesToShow[0]} />
      ) : (
        <Countries countries={countriesToShow} handleClick={handleClick} />
      )}
      {selectedCountry && <Country data={selectedCountry} />}
    </div>
  );
}

export default App;
