import Anecdote from "./Anecdote";

const AnecdoteList = ({ anecdotes }) => {
  return (
    <section>
      {anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <Anecdote key={anecdote.id} anecdote={anecdote} />
        ))}
    </section>
  );
};

export default AnecdoteList;
