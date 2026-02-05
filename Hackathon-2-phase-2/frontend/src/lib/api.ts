import { Task, CreateTaskInput, UpdateTaskInput, AuthResponse, TaskStats } from "./definitions";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// ==================== AUTH ====================

export async function registerUser(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    const message = error?.detail?.message || error?.detail || "Registration failed";
    throw new Error(message);
  }

  return response.json();
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    const message = error?.detail?.message || error?.detail || "Login failed";
    throw new Error(message);
  }

  return response.json();
}

// ==================== TASKS ====================

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/tasks/`, {
    headers: authHeaders(),
    cache: "no-store",
  });

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}

export async function getTaskStats(): Promise<TaskStats> {
  const response = await fetch(`${API_BASE_URL}/api/v1/tasks/stats`, {
    headers: authHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  return response.json();
}

export async function createTask(data: CreateTaskInput): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/api/v1/tasks/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create task");
  }

  return response.json();
}

export async function updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/api/v1/tasks/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update task");
  }

  return response.json();
}

export async function deleteTask(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/tasks/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return response.ok || response.status === 204;
}

export async function deleteAllTasks(): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/tasks/`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return response.ok;
}
