import Part from "./Part";

const Content = ({ course }) => {
  const parts = course.parts;

  return (
    <>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </>
  );
};

export default Content;
