const Persons = ({ data, deletePerson }) => {
  return (
    <div>
      {data.map((person) => (
        <div key={person.name}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person.id)}>delete</button>
        </div>
      ))}
    </div>
  );
};

export default Persons;
