"use client";

import { useState } from "react";

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const addOrEditTask = () => {
    if (task.trim()) {
      if (editIndex !== null) {
        // Edit mode
        const updatedTasks = [...tasks];
        updatedTasks[editIndex] = task.trim();
        setTasks(updatedTasks);
        setEditIndex(null);
      } else {
        // Add mode
        setTasks([...tasks, task.trim()]);
      }
      setTask("");
    }
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
    if (editIndex === index) {
      setEditIndex(null);
      setTask("");
    }
  };

  const startEditTask = (index: number) => {
    setEditIndex(index);

  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4">
        {editIndex !== null ? "Edit Task" : "Add a Task"}
      </h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded px-3 py-2"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
        />
        <button
          onClick={addOrEditTask}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>
      <ul className="space-y-2">
        {tasks.map((t, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
          >
            <span>{t}</span>
            <div className="flex gap-2">
              <button
                onClick={() => startEditTask(index)}
                className="text-blue-500 hover:text-blue-700"
              >
                ✎
              </button>
              <button
                onClick={() => removeTask(index)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
