import { useDispatch, useSelector } from "react-redux";
import { handleVoteAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  );
};

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    if (filter === "NO_FILTER") {
      return anecdotes;
    }

    console.log(anecdotes);

    return anecdotes.filter((anecdote) => {
      return anecdote.content.toLowerCase().includes(filter.toLowerCase());
    });
  });

  const handleVote = (anecdote) => {
    dispatch(handleVoteAnecdote(anecdote));
    dispatch(setNotification(`you voted '${anecdote.content}'`));
  };

  return (
    <section>
      {anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <Anecdote
            key={anecdote.id}
            anecdote={anecdote}
            handleClick={() => handleVote(anecdote)}
          />
        ))}
    </section>
  );
};

export default AnecdoteList;
