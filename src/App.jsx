import { useState, useEffect } from "react";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { initDb } from "./electric";

const db = await initDb();

export const App = () => {
  const [name, setName] = useState("");
  const [completed, setCompleted] = useState(false);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const result = await db.query("SELECT * FROM tasks ORDER BY name");
    setTasks(result.rows);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.query(
        "INSERT INTO tasks (id, name, completed) VALUES ($1, $2, $3)",
        [crypto.randomUUID(), name, completed]
      );
      setName("");
      setCompleted(false);
      await fetchTasks();
    } catch (error) {
      console.error("Error inserting item:", error);
    }
  };

  return (
    <PGliteProvider db={db}>
      <div style={styles.container}>
        <h1 style={styles.title}>📝 Task Manager</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Enter task name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              style={styles.checkbox}
            />
            Completed
          </label>
          <button type="submit" style={styles.button}>
            Add Task
          </button>
        </form>

        <h2 style={styles.subtitle}>📋 Task List</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Completed</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td style={styles.td}>
                  <input
                    type="text"
                    value={task.name}
                    onChange={async (e) => {
                      const newName = e.target.value;
                      await db.query(
                        "UPDATE tasks SET name = $1 WHERE id = $2",
                        [newName, task.id]
                      );
                      await fetchTasks();
                    }}
                    style={styles.input}
                  />
                </td>
                <td style={styles.td}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={async (e) => {
                      const newStatus = e.target.checked;
                      await db.query(
                        "UPDATE tasks SET completed = $1 WHERE id = $2",
                        [newStatus, task.id]
                      );
                      await fetchTasks();
                    }}
                    style={styles.checkbox}
                  />
                </td>
                <td style={styles.td}>
                  <button
                    onClick={async () => {
                      await db.query("DELETE FROM tasks WHERE id = $1", [
                        task.id,
                      ]);
                      await fetchTasks();
                    }}
                    style={styles.deleteButton}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PGliteProvider>
  );
};
const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    marginTop: "30px",
    color: "#555",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "16px",
  },
  checkbox: {
    transform: "scale(1.2)",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007c1fff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    textAlign: "left",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: "16px",
  },
};
