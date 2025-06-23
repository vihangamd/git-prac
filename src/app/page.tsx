"use client";

import { useState } from "react";
import { Tooltip } from "flowbite-react";
import { ToggleButton } from "@/component/ToggleButton";
import ClockRangeChart from "../component/ClockCards";
import { Switch } from "@headlessui/react";
import { createContext, useContext } from "react";

type Task = {
  text: string;
  completed: boolean;
};

type CardData = {
  name: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  status: string;
};

const mockCards: CardData[] = [
  {
    name: "Schedule A",
    startTime: "4:30 PM",
    endTime: "2:45 AM",
    createdAt: "2025-06-01 10:00",
    updatedAt: "2025-06-10 12:00",
    status: "ACTIVE",
  },
  {
    name: "Schedule B",
    startTime: "8:00 AM",
    endTime: "5:00 PM",
    createdAt: "2025-05-21 09:15",
    updatedAt: "2025-06-08 15:30",
    status: "INACTIVE",
  },
  {
    name: "Schedule C",
    startTime: "6:00 AM",
    endTime: "3:00 PM",
    createdAt: "2025-04-18 08:45",
    updatedAt: "2025-06-07 14:50",
    status: "ACTIVE",
  },
  {
    name: "Schedule D",
    startTime: "9:00 AM",
    endTime: "6:00 PM",
    createdAt: "2025-03-30 11:00",
    updatedAt: "2025-06-06 16:00",
    status: "ACTIVE",
  },
  {
    name: "Schedule E",
    startTime: "7:30 AM",
    endTime: "4:30 PM",
    createdAt: "2025-02-11 10:20",
    updatedAt: "2025-06-05 11:55",
    status: "INACTIVE",
  },
  {
    name: "Schedule F",
    startTime: "10:00 AM",
    endTime: "7:00 PM",
    createdAt: "2025-01-15 13:00",
    updatedAt: "2025-06-04 17:10",
    status: "ACTIVE",
  },
  {
    name: "Schedule G",
    startTime: "5:00 AM",
    endTime: "1:00 PM",
    createdAt: "2024-12-10 07:30",
    updatedAt: "2025-06-03 09:25",
    status: "INACTIVE",
  },
];

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [is24Hour, setIs24Hour] = useState(false);
  const addOrEditTask = () => {
    if (task.trim()) {
      if (editIndex !== null) {
        const updatedTasks = [...tasks];
        updatedTasks[editIndex].text = task.trim();
        setTasks(updatedTasks);
        setEditIndex(null);
      } else {
        setTasks([...tasks, { text: task.trim(), completed: false }]);
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
    setTask(tasks[index].text);
  };

  const toggleComplete = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  return (
    <div className="p-6 mx-auto max-w-7xl bg-stone-100">
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

      <ul className="space-y-2 mb-8">
        {tasks.map((t, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
          >
            <div className="flex items-center gap-2">
              <Tooltip
                content={
                  t.completed ? "Mark as Incomplete" : "Mark as Complete"
                }
                placement="top"
              >
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleComplete(index)}
                />
              </Tooltip>
              <span className={t.completed ? "line-through text-gray-500" : ""}>
                {t.text}
              </span>
            </div>
            <div className="flex gap-2">
              <Tooltip content="Edit Task" placement="top">
                <button
                  onClick={() => startEditTask(index)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ✎
                </button>
              </Tooltip>
              <Tooltip content="Delete Task" placement="top">
                <button
                  disabled={t.completed}
                  onClick={() => removeTask(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </Tooltip>
            </div>
          </li>
        ))}
      </ul>
      <ClockModeContext.Provider value={is24Hour}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-center">
          <Switch
            checked={is24Hour}
            onChange={setIs24Hour}
            className={`${
              is24Hour ? "bg-blue-600" : "bg-gray-300"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          />
          {mockCards.map((card, index) => (
            <div
              key={index}
              className="flex w-[250px] flex-col gap-4 rounded-lg bg-white p-3 shadow-md transition-transform duration-200 hover:scale-105"
            >
              <div className="w-full aspect-square flex items-center justify-center">
                <ClockRangeChart startTime={"14:10:00"} endTime={"18:20:00"} />
              </div>

              {/* <div className="flex grow flex-col p-2 space-y-1">
              <span className="text-lg font-semibold text-gray-800">
                {card.name}
              </span>
              <span className="text-sm text-gray-500">
                Allowed Start Time: {card.startTime}
              </span>
              <span className="text-sm text-gray-500">
                Allowed End Time: {card.endTime}
              </span>
              <span className="text-sm text-gray-500">
                Created: {card.createdAt}
              </span>
              <span className="text-sm text-gray-500">
                Updated: {card.updatedAt}
              </span>
              <p className="text-sm text-gray-600">Status: {card.status}</p>
            </div> */}
              <div className="flex grow flex-col p-2 space-y-2">
                {/* Title Section */}
                <div className="pb-2 border-b border-gray-200">
                  <span className="text-lg font-semibold text-gray-800">
                    {card.name}
                  </span>
                </div>

                {/* Metadata Section */}
                <div className="pt-2 space-y-1 text-sm text-gray-600">
                  <div>
                    Allowed Start Time:{" "}
                    <span className="font-medium">{card.startTime}</span>
                  </div>
                  <div>
                    Allowed End Time:{" "}
                    <span className="font-medium">{card.endTime}</span>
                  </div>
                  <div>
                    Created:{" "}
                    <span className="font-medium">{card.createdAt}</span>
                  </div>
                  <div>
                    Updated:{" "}
                    <span className="font-medium">{card.updatedAt}</span>
                  </div>
                  <div>
                    Status:{" "}
                    <span className="font-semibold text-blue-600">
                      {card.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-[calc(100%_-_24px)] mx-auto my-2 border-t border-gray-300"></div>

              <div className="mt-auto flex items-center justify-between gap-3">
                <div>
                  <ToggleButton />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button className="text-blue-500 hover:text-blue-700">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ClockModeContext.Provider>
    </div>
  );
}

export const ClockModeContext = createContext(false);

export const useClockMode = () => useContext(ClockModeContext);
