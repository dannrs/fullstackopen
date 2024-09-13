const Total = ({ course }) => {
  const exercises = course.parts.map((part) => part.exercises);
  const totalExercises = exercises.reduce(
    (total, currentValue) => total + currentValue,
    0
  );
  return (
    <p>
      <strong>Total of {totalExercises} exercises</strong>
    </p>
  );
};

export default Total;
