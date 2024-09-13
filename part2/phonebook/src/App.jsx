import { useState, useEffect } from "react";
import personsService from "./services/persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newNumber, setNewNumber] = useState("");
  const [newName, setNewName] = useState("");
  const [search, setSearch] = useState("");
  const [notificationMessage, setNotificationMessage] = useState({
    message: null,
    isError: false,
  });

  useEffect(() => {
    personsService
      .getAll()
      .then((initialData) => {
        setPersons(initialData);
      })
      .catch((error) => {
        console.log(error);
        setNotificationMessage({
          message: `Failed to fetch the data`,
          isError: true,
        });
      })
      .finally(() => {
        setTimeout(() => {
          setNotificationMessage({ message: null, isError: false });
        }, 5000);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook. Replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        personsService
          .update(existingPerson.id, updatedPerson)
          .then((returnedData) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : returnedData
              )
            );
            setNotificationMessage({
              message: `Updated ${returnedData.name}`,
              isError: false,
            });
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            console.log(error);
            setPersons(
              persons.filter((person) => person.id !== existingPerson.id)
            );
            setNotificationMessage({
              message: `Person ${existingPerson.name} was already removed from the server`,
              isError: true,
            });
          })
          .finally(() => {
            setTimeout(() => {
              setNotificationMessage({ message: null, isError: false });
            }, 5000);
          });
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };

      personsService
        .create(personObject)
        .then((returnedData) => {
          setPersons(persons.concat(returnedData));
          setNotificationMessage({
            message: `Added ${newName}`,
            isError: false,
          });
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          console.log(error);
          setNotificationMessage({
            message: `Failed to add ${newName}`,
            isError: true,
          });
        })
        .finally(() => {
          setTimeout(() => {
            setNotificationMessage({ message: null, isError: false });
          }, 5000);
        });
    }
  };

  const deletePerson = (id) => {
    const person = persons.find((person) => person.id == id);

    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .deleteData(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setNotificationMessage({
            message: `Deleted ${person.name}`,
            isError: false,
          });
        })
        .catch((error) => {
          console.log(error);
          setPersons(persons.filter((person) => person.id !== id));
          setNotificationMessage({
            message: `Person of ${person.name} was already removed from the server`,
            isError: true,
          });
        })
        .finally(() => {
          setTimeout(() => {
            setNotificationMessage({ message: null, isError: false });
          }, 5000);
        });
    }
  };

  const filteredPerson = persons.filter((person) => {
    if (search === "") {
      return person;
    } else if (person.name.toLowerCase().includes(search.toLowerCase())) {
      return person;
    }
  });

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notificationMessage.message}
        isError={notificationMessage.isError}
      />
      <Filter handleSearch={handleSearch} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons data={filteredPerson} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
