"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  Circle,
  Edit3,
  X,
  ListTodo,
  Target,
  CheckSquare,
  Clock,
  Loader2,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { Task, CreateTaskInput, TaskStats } from "@/lib/definitions";
import {
  getTasks,
  getTaskStats,
  createTask,
  updateTask,
  deleteTask,
  deleteAllTasks,
} from "@/lib/api";

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  medium: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  urgent: "bg-red-500/10 text-red-500 border-red-500/20",
};

const CATEGORY_COLORS: Record<string, string> = {
  personal: "bg-violet-500/10 text-violet-400",
  work: "bg-blue-500/10 text-blue-400",
  shopping: "bg-pink-500/10 text-pink-400",
  health: "bg-emerald-500/10 text-emerald-400",
  finance: "bg-yellow-500/10 text-yellow-400",
  education: "bg-cyan-500/10 text-cyan-400",
  other: "bg-gray-500/10 text-gray-400",
};

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newCategory, setNewCategory] = useState("personal");
  const [newDueDate, setNewDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [tasksData, statsData] = await Promise.all([getTasks(), getTaskStats()]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (err: any) {
      if (err?.message === "UNAUTHORIZED") {
        router.push("/auth/signin");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }
    fetchData();
  }, [isAuthenticated, authLoading, router, fetchData]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSubmitting(true);

    try {
      const data: CreateTaskInput = {
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
        priority: newPriority,
        category: newCategory,
        due_date: newDueDate || undefined,
      };
      await createTask(data);
      setNewTitle("");
      setNewDescription("");
      setNewPriority("medium");
      setNewCategory("personal");
      setNewDueDate("");
      setShowAddForm(false);
      await fetchData();
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await updateTask(task.id, { completed: !task.completed });
      await fetchData();
    } catch {}
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    setSubmitting(true);

    try {
      await updateTask(editingTask.id, {
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
        priority: newPriority,
        category: newCategory,
        due_date: newDueDate || undefined,
      });
      setEditingTask(null);
      resetForm();
      await fetchData();
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      await fetchData();
    } catch {}
  };

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete all tasks? This cannot be undone.")) return;
    try {
      await deleteAllTasks();
      await fetchData();
    } catch {}
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setNewTitle(task.title);
    setNewDescription(task.description || "");
    setNewPriority(task.priority);
    setNewCategory(task.category);
    setNewDueDate(task.due_date || "");
    setShowAddForm(false);
  };

  const resetForm = () => {
    setNewTitle("");
    setNewDescription("");
    setNewPriority("medium");
    setNewCategory("personal");
    setNewDueDate("");
    setShowAddForm(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(search.toLowerCase());
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && task.completed) ||
      (filterStatus === "pending" && !task.completed);
    return matchesSearch && matchesPriority && matchesStatus;
  });

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border bg-card p-6 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <ListTodo className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <CheckSquare className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6 flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 rounded-xl">
            <Clock className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl"
          />
        </div>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="h-11 rounded-xl border bg-card px-3 text-sm"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-11 rounded-xl border bg-card px-3 text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <Button
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
          className="rounded-xl h-11"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Task
        </Button>
      </div>

      {/* Add / Edit Task Form */}
      {(showAddForm || editingTask) && (
        <div className="rounded-2xl border bg-card p-6 mb-6 animate-fade-in-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {editingTask ? "Edit Task" : "New Task"}
            </h3>
            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={editingTask ? handleUpdateTask : handleAddTask} className="space-y-4">
            <Input
              placeholder="Task title *"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="h-12 rounded-xl text-base"
              required
            />
            <Input
              placeholder="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="h-12 rounded-xl"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="h-12 rounded-xl border bg-background px-3 text-sm"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent Priority</option>
              </select>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="h-12 rounded-xl border bg-background px-3 text-sm"
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="shopping">Shopping</option>
                <option value="health">Health</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
              <Input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="rounded-xl" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : null}
                {editingTask ? "Update Task" : "Add Task"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border bg-card">
          <ListTodo className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {tasks.length === 0 ? "No tasks yet" : "No matching tasks"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {tasks.length === 0
              ? "Create your first task to get started!"
              : "Try adjusting your search or filters."}
          </p>
          {tasks.length === 0 && (
            <Button onClick={() => setShowAddForm(true)} className="rounded-xl">
              <Plus className="h-4 w-4 mr-1.5" />
              Create First Task
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`group rounded-2xl border bg-card p-5 transition-all hover:shadow-md ${
                task.completed ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Toggle button */}
                <button
                  onClick={() => handleToggleComplete(task)}
                  className="mt-0.5 shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      className={`font-semibold text-base ${
                        task.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(task)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${
                        PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                        CATEGORY_COLORS[task.category] || CATEGORY_COLORS.other
                      }`}
                    >
                      {task.category}
                    </span>
                    {task.due_date && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.due_date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete All */}
      {tasks.length > 0 && (
        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteAll}
            className="text-muted-foreground hover:text-destructive rounded-xl"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Delete All Tasks ({tasks.length})
          </Button>
        </div>
      )}
    </div>
  );
}
