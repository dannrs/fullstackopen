const mongoose = require("mongoose");

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://danni:${password}@cluster0.djmoa.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 3) {
  console.log("you have to at least give password as an argument");
  process.exit(1);
} else if (process.argv.length < 4) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((note) => {
      console.log(`${note.name} ${note.number}`);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
