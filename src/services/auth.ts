import type { LoginData, LoginResponse, RegisterData } from "../types/auth";

export async function registerUser(registerData: RegisterData): Promise<RegisterData> {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData)
  })

  if (!res.ok) {
    throw new Error("Registration failed");
  }

  return res.json();
}

export async function loginUser(loginData: LoginData): Promise<LoginResponse> {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData)
  })

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}