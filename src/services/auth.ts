import type { LoginData, LoginResponse, RegisterData, RegisterResponse } from "../types/auth";
import { ROUTES } from "../utils/constants";

export async function registerUser(registerData: RegisterData): Promise<RegisterResponse> {
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

export async function requireAuth(): Promise<boolean> {
  const res = await fetch("/api/session", {
    method: "GET",
  });

  if (res.ok) {
    return true;
  }

  window.location.replace(ROUTES.login)
  return false;
}