import { useEffect, useState } from "react";

const STORAGE_KEY = "react-task-manager-tasks";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (!savedTasks) {
      return [];
    }

    try {
      const parsedTasks = JSON.parse(savedTasks);

      return Array.isArray(parsedTasks)
        ? parsedTasks
        : [];
    } catch {
      return [];
    }
  });

  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [notes, setNotes] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks)
    );
  }, [tasks]);

  const totalTasks = tasks.length;

  const inProgressTasks = tasks.filter((task) => {
    return !task.completed;
  }).length;

  const completedTasks = tasks.filter((task) => {
    return task.completed;
  }).length;

  const filteredTasks = tasks.filter((task) => {
    const searchValue = searchTerm.toLowerCase().trim();

    const matchesSearch =
      task.name.toLowerCase().includes(searchValue) ||
      task.notes.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "In Progress" && !task.completed) ||
      (statusFilter === "Completed" && task.completed);

    return matchesSearch && matchesStatus;
  });

  function handleSubmit(event) {
    event.preventDefault();

    const cleanedTaskName = taskName.trim();

    if (!cleanedTaskName) {
      return;
    }

    const newTask = {
      id: Date.now(),
      name: cleanedTaskName,
      priority,
      notes: notes.trim(),
      completed: false
    };

    setTasks((currentTasks) => {
      return [...currentTasks, newTask];
    });

    setTaskName("");
    setPriority("Medium");
    setNotes("");
  }

  function toggleTaskCompletion(taskId) {
    setTasks((currentTasks) => {
      return currentTasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            completed: !task.completed
          };
        }

        return task;
      });
    });
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) => {
      return currentTasks.filter((task) => {
        return task.id !== taskId;
      });
    });
  }

  function clearCompletedTasks() {
    const userConfirmed = confirm(
      "Remove all completed tasks?"
    );

    if (!userConfirmed) {
      return;
    }

    setTasks((currentTasks) => {
      return currentTasks.filter((task) => {
        return !task.completed;
      });
    });

    setStatusFilter("All");
  }

  return (
    <main className="app-shell">
      <section className="hero-panel" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Task Manager</p>

          <h1 id="page-title">
            Plan the day with calm precision.
          </h1>

          <p className="hero-copy">
            Create organized tasks, set priorities, and keep track of what
            needs your attention.
          </p>
        </div>

        <div className="hero-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </section>

      <section
        className="dashboard-grid"
        aria-label="Task dashboard summary"
      >
        <article className="summary-card">
          <span>Total tasks</span>
          <strong>{totalTasks}</strong>
        </article>

        <article className="summary-card">
          <span>In progress</span>
          <strong>{inProgressTasks}</strong>
        </article>

        <article className="summary-card">
          <span>Completed</span>
          <strong>{completedTasks}</strong>
        </article>
      </section>

      <section className="workspace-grid">
        <form
          className="task-form"
          aria-labelledby="task-form-title"
          onSubmit={handleSubmit}
        >
          <div className="section-heading">
            <p className="eyebrow">New task</p>
            <h2 id="task-form-title">Add a task</h2>
          </div>

          <label htmlFor="taskName">
            Task name

            <input
              id="taskName"
              type="text"
              placeholder="Example: Finish React task manager"
              value={taskName}
              onChange={(event) => {
                setTaskName(event.target.value);
              }}
              required
            />
          </label>

          <label htmlFor="priority">
            Priority

            <select
              id="priority"
              value={priority}
              onChange={(event) => {
                setPriority(event.target.value);
              }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>

          <label htmlFor="notes">
            Notes

            <textarea
              id="notes"
              rows="4"
              placeholder="Add context for this task"
              value={notes}
              onChange={(event) => {
                setNotes(event.target.value);
              }}
            />
          </label>

          <button type="submit">Create task</button>
        </form>

        <section
          className="task-list-panel"
          aria-labelledby="task-list-title"
        >
          <div className="section-heading task-list-heading">
            <div>
              <p className="eyebrow">Queue</p>
              <h2 id="task-list-title">Task list</h2>
            </div>

            <button
              type="button"
              className="clear-completed-button"
              onClick={clearCompletedTasks}
              disabled={completedTasks === 0}
            >
              Clear Completed
            </button>
          </div>

          <div className="task-filter-bar">
            <input
              type="search"
              placeholder="Search tasks or notes..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
              }}
            >
              <option value="All">All tasks</option>
              <option value="In Progress">In progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">
                <span />
              </div>

              <h3>No tasks yet</h3>

              <p>
                Add your first task using the form. It will appear here
                immediately.
              </p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <h3>No matching tasks</h3>

              <p>
                Try changing your search words or task status filter.
              </p>
            </div>
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => {
                return (
                  <article
                    className={`task-item ${
                      task.completed ? "task-completed" : ""
                    }`}
                    key={task.id}
                  >
                    <div className="task-item-header">
                      <div>
                        <h3>{task.name}</h3>

                        <p className="task-status">
                          Status:{" "}
                          {task.completed
                            ? "Completed"
                            : "In progress"}
                        </p>
                      </div>

                      <span
                        className={`priority-tag priority-${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    {task.notes && (
                      <p className="task-notes">
                        {task.notes}
                      </p>
                    )}

                    <div className="task-actions">
                      <button
                        type="button"
                        className="complete-button"
                        onClick={() => {
                          toggleTaskCompletion(task.id);
                        }}
                      >
                        {task.completed
                          ? "Mark In Progress"
                          : "Mark Complete"}
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => {
                          deleteTask(task.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;