import { useQuery } from "@tanstack/react-query";
import { getAnecdotes } from "./requests";

import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Notification from "./components/Notification";

const App = () => {
  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
  });

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  const anecdotes = result.data;

  return (
    <div>
      {result.isError ? (
        <div>anecdote service not available due to problems in server</div>
      ) : (
        <div>
          <h3>Anecdote app</h3>
          <Notification />
          <AnecdoteForm />
          <AnecdoteList anecdotes={anecdotes} />
        </div>
      )}
    </div>
  );
};

export default App;
