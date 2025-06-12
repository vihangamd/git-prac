"use client";

import { useState } from "react";

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, task.trim()]);
      setTask("");
    }
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4">Add a Task</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded px-3 py-2"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a new task"
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {tasks.map((t, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
          >
            <span>{t}</span>
            <button
              onClick={() => removeTask(index)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
            ;
          </li>
        ))}
      </ul>
    </div>
  );
}
