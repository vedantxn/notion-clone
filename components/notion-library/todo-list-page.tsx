"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Check,
  ListChecks,
  List,
  CheckSquare,
  ListFilter,
  ArrowUpDown,
  Zap,
  Sparkles,
  Search,
  Maximize2,
  SlidersHorizontal,
  ChevronDown,
  Plus,
} from "lucide-react";

type Task = { id: string; name: string; due: "Today" | "Tomorrow"; done?: boolean };

const INITIAL: Task[] = [
  { id: "t1", name: "Check the box to mark items as done", due: "Today", done: true },
  { id: "t2", name: "Click the due date to change it", due: "Today" },
  { id: "t3", name: "Click me to see even more detail", due: "Today" },
  { id: "t4", name: "Click the blue New button to add a task", due: "Today" },
  { id: "t5", name: "Click me to learn how to hide checked items", due: "Today" },
  { id: "t6", name: "See finished items in the “Done” view", due: "Today" },
  { id: "t7", name: "Click me to learn how to see your content your way", due: "Tomorrow" },
];

let seq = 100;

export function TodoListPage({ fullWidth }: { fullWidth?: boolean }) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL);
  const [view, setView] = useState<"todo" | "done">("todo");

  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const addTask = () => {
    const nt: Task = { id: `t${++seq}`, name: "", due: "Today" };
    setTasks((prev) => [...prev, nt]);
    toast("New task");
  };

  const rename = (id: string, name: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)));

  const visible = view === "done" ? tasks.filter((t) => t.done) : tasks;

  return (
    <div className={"mx-auto w-full px-16 pt-14 pb-24 " + (fullWidth ? "max-w-full" : "max-w-[900px]")}>
      {/* Page icon */}
      <ListChecks className="h-[68px] w-[68px] text-[#448361]" strokeWidth={2} />

      {/* Title */}
      <h1 className="mt-3 mb-5 text-[40px] font-bold leading-[1.2] text-[#2C2C2B]">To Do List</h1>

      {/* View bar */}
      <div className="flex items-center justify-between border-b border-black/[0.08] pb-1.5">
        <div className="flex items-center gap-1">
          <ViewTab active={view === "todo"} onClick={() => setView("todo")} icon={<List className="h-4 w-4" strokeWidth={2} />}>
            To Do
          </ViewTab>
          <ViewTab active={view === "done"} onClick={() => setView("done")} icon={<CheckSquare className="h-4 w-4" strokeWidth={2} />}>
            Done
          </ViewTab>
        </div>

        <div className="flex items-center gap-0.5 text-[#5F5E59]">
          <TbIcon label="Filter"><ListFilter className="h-[18px] w-[18px]" strokeWidth={1.8} /></TbIcon>
          <TbIcon label="Sort"><ArrowUpDown className="h-[18px] w-[18px]" strokeWidth={1.8} /></TbIcon>
          <TbIcon label="Automations"><Zap className="h-[18px] w-[18px]" strokeWidth={1.8} /></TbIcon>
          <TbIcon label="Notion AI"><Sparkles className="h-[18px] w-[18px]" strokeWidth={1.8} /></TbIcon>
          <TbIcon label="Search"><Search className="h-[18px] w-[18px]" strokeWidth={1.8} /></TbIcon>
          <TbIcon label="Open as full page"><Maximize2 className="h-[18px] w-[18px]" strokeWidth={1.8} /></TbIcon>
          <TbIcon label="Options"><SlidersHorizontal className="h-[18px] w-[18px]" strokeWidth={1.8} /></TbIcon>
          <div className="ml-1.5 flex h-7 items-stretch overflow-hidden rounded-md bg-[#2383E2] text-white">
            <button onClick={addTask} className="flex items-center px-2.5 text-[13px] font-medium hover:bg-[#1a73d0]">
              New
            </button>
            <button onClick={() => toast("New task options")} className="flex items-center border-l border-white/25 px-1 hover:bg-[#1a73d0]">
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Rows */}
      <div>
        {visible.map((t) => (
          <div
            key={t.id}
            className="group flex items-center gap-2.5 border-b border-black/[0.055] py-[7px] pl-0.5"
          >
            <button
              onClick={() => toggle(t.id)}
              aria-label="Toggle task"
              className={
                "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-colors " +
                (t.done ? "border-[#2383E2] bg-[#2383E2] text-white" : "border-[#C6C4C0] hover:bg-black/[0.04]")
              }
            >
              {t.done && <Check className="h-3 w-3" strokeWidth={3} />}
            </button>
            <input
              value={t.name}
              onChange={(e) => rename(t.id, e.target.value)}
              placeholder="Untitled"
              className={
                "flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#B4B1AB] " +
                (t.done ? "text-[#9B9A97]" : "text-[#2C2C2B]")
              }
            />
            <button
              onClick={() => toast(t.due)}
              className="shrink-0 rounded px-1.5 py-0.5 text-[14px] text-[#5F5E59] opacity-90 hover:bg-black/[0.04]"
            >
              {t.due}
            </button>
          </div>
        ))}

        {/* New task row */}
        <button
          onClick={addTask}
          className="flex w-full items-center gap-2 py-2 pl-0.5 text-[15px] text-[#9B9A97] transition-colors hover:text-[#5F5E59]"
        >
          <Plus className="h-[18px] w-[18px]" strokeWidth={1.8} />
          New task
        </button>
      </div>
    </div>
  );
}

function ViewTab({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "flex h-8 items-center gap-1.5 rounded-md px-2 text-[14px] font-medium transition-colors " +
        (active ? "bg-black/[0.05] text-[#2C2C2B]" : "text-[#787774] hover:bg-black/[0.03]")
      }
    >
      {icon}
      {children}
    </button>
  );
}

function TbIcon({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      onClick={() => toast(label)}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-black/[0.05]"
    >
      {children}
    </button>
  );
}
