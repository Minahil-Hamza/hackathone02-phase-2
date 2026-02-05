export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  category: "personal" | "work" | "shopping" | "health" | "finance" | "education" | "other";
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: string;
  category?: string;
  due_date?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: string;
  category?: string;
  due_date?: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}
