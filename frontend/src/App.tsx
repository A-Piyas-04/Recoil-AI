import { useEffect, useState } from "react";
import { api } from "./lib/api";
import "./App.css";

function App() {
  const [message, setMessage] = useState<string>("Loading…");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ message: string }>("/api/v1/ping")
      .then((data) => setMessage(data.message))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <main className="app">
      <h1>Codex Meetup</h1>
      <p className="tagline">FastAPI · React · PostgreSQL</p>
      {error ? (
        <p className="status error">API: {error}</p>
      ) : (
        <p className="status">API says: {message}</p>
      )}
    </main>
  );
}

export default App;
