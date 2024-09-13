function Countries({ countries, handleClick }) {
  return (
    <ul>
      {countries.length < 10 &&
        countries.map((country) => (
          <li key={country.cca3}>
            {country.name.common}
            <button onClick={() => handleClick(country)}>show</button>
          </li>
        ))}
    </ul>
  );
}

export default Countries;
