import type { LoginData } from "../pages/login";
import type { RegisterData } from "../pages/register";

export async function testPromise() {
  try {
    console.log("Pending...")
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log("done")
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}

export async function registerUser(registerData: RegisterData) {
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

export async function loginUser(loginData: LoginData) {
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