
import React, { useMemo, useState } from 'react';
import {
  Check,
  Circle,
  ClipboardList,
  Clock3,
  Plus,
  Search,
  Trash2,
  ListTodo,
  Sparkles,
  CalendarDays,
} from 'lucide-react';
import './styles.css';

const initialTasks = [];

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personal');
  const [priority, setPriority] = useState('Medium');
  const [filter, setFilter] = useState('All tasks');
  const [query, setQuery] = useState('');

  const addTask = (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setTasks((currentTasks) => [
      {
        id: Date.now(),
        title: trimmedTitle,
        category,
        priority,
        done: false,
      },
      ...currentTasks,
    ]);

    setTitle('');
  };

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        filter === 'All tasks' ||
        (filter === 'Completed' && task.done) ||
        (filter === 'Pending' && !task.done);

      const matchesSearch = task.title
        .toLowerCase()
        .includes(query.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, query]);

  const completedCount = tasks.filter((task) => task.done).length;
  const percentage = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  const navigation = [
    { name: 'All tasks', icon: ClipboardList },
    { name: 'Pending', icon: Clock3 },
    { name: 'Completed', icon: Check },
  ];

  const toggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  return (
    <main className="shell">
      <aside className="sidebar">
        <a className="brand" href="#">
          <span className="brand-icon">
            <ListTodo />
          </span>
          taskflow<span className="dot">.</span>
        </a>

        <small className="label">WORKSPACE</small>

        <nav>
          {navigation.map(({ name, icon: Icon }) => (
            <button
              key={name}
              type="button"
              className={filter === name ? 'nav active' : 'nav'}
              onClick={() => setFilter(name)}
            >
              <Icon size={18} />
              {name}
              {name === 'All tasks' && <span>{tasks.length}</span>}
            </button>
          ))}
        </nav>

        <div className="profile">
          <span>TH</span>
          <div>
            <b>Tansin Habib</b>
            <small>Personal workspace</small>
          </div>
        </div>
      </aside>

      <section className="main">
        <header>
          <div>
            <small>
              Workspace / <b>My tasks</b>
            </small>
            <h1>
              My tasks
              <span className="today">
                <CalendarDays size={14} /> Today
              </span>
            </h1>
          </div>

          <a
            href="https://github.com/tansinhabib26/ToDoList"
            target="_blank"
            rel="noreferrer"
            className="source"
          >
            View source ↗
          </a>
        </header>

        <section className="hero">
          <div>
            <small>
              <Sparkles size={14} /> YOUR DAY, IN FOCUS
            </small>
            <h2>
              Make space for
              <br />
              <em>what matters.</em>
            </h2>
            <p>
              A little progress every day adds up. Capture a task,
              choose a priority, and keep moving.
            </p>
          </div>

          <div className="progress">
            <div
              className="ring"
              style={{ '--pct': `${percentage}%` }}
            >
              <div>
                <b>{percentage}%</b>
                <small>done</small>
              </div>
            </div>

            <div>
              <b>Your progress</b>
              <p>
                {completedCount} of {tasks.length} tasks completed
              </p>
              <div className="bar">
                <i style={{ width: `${percentage}%` }} />
              </div>
            </div>
          </div>
        </section>

        <section className="layout">
          <div>
            <div className="section-title">
              <div>
                <h3>{filter}</h3>
                <p>You’ve got this. One task at a time.</p>
              </div>
              <span className="count">{visibleTasks.length} tasks</span>
            </div>

            <div className="search">
              <Search size={17} />
              <input
                type="search"
                placeholder="Search tasks..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <div className="list">
              {visibleTasks.length > 0 ? (
                visibleTasks.map((task) => (
                  <article
                    className={`task ${task.done ? 'is-done' : ''}`}
                    key={task.id}
                  >
                    <button
                      type="button"
                      className="check"
                      aria-label={
                        task.done ? 'Mark as pending' : 'Mark as completed'
                      }
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.done ? <Check size={15} /> : <Circle size={18} />}
                    </button>

                    <div className="task-body">
                      <b>{task.title}</b>
                      <div className="meta">
                        <span className={`category ${task.category.toLowerCase()}`}>
                          {task.category}
                        </span>
                        <span className={`priority ${task.priority.toLowerCase()}`}>
                          <i />
                          {task.priority} priority
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="delete"
                      aria-label={`Delete ${task.title}`}
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </article>
                ))
              ) : (
                <div className="empty">
                  <ListTodo />
                  <b>No tasks found</b>
                  <p>Add a task or try another search.</p>
                </div>
              )}
            </div>
          </div>

          <aside className="add-panel">
            <span className="plus-icon">
              <Plus />
            </span>
            <h3>Add a task</h3>
            <p>Write it down to make it happen.</p>

            <form onSubmit={addTask}>
              <label htmlFor="title">Task name</label>
              <input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="What needs to get done?"
                required
                maxLength={120}
              />

              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option>Personal</option>
                <option>Learning</option>
                <option>Career</option>
              </select>

              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <button className="submit" type="submit">
                <Plus size={16} /> Add task
              </button>
            </form>

            <div className="tip">
              <Sparkles size={16} />
              <p>
                <b>Small tip</b>
                <br />
                Break big goals into small, doable tasks. Consistency
                beats intensity.
              </p>
            </div>
          </aside>
        </section>

        <footer>
          Built with React by <b>Tansin Habib</b> ·{' '}
          <a
            href="https://github.com/tansinhabib26"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </footer>
      </section>
    </main>
  );
}
