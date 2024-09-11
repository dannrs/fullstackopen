const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  );
};

const Header = ({ course }) => {
  const name = course.name;
  return <h1>{name}</h1>;
};

const Content = ({ course }) => {
  const part1 = course.parts[0];
  const part2 = course.parts[1];
  const part3 = course.parts[2];

  return (
    <>
      <Part part={part1} />
      <Part part={part2} />
      <Part part={part3} />
    </>
  );
};

const Part = ({ part }) => {
  const name = part.name;
  const exercises = part.exercises;

  return (
    <div>
      <p>
        {name} {exercises}
      </p>
    </div>
  );
};

const Total = ({ course }) => {
  const parts = course.parts;
  return (
    <p>
      Number of exercises{" "}
      {parts[0].exercises + parts[1].exercises + parts[2].exercises}
    </p>
  );
};

export default App;
