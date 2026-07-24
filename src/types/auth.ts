export type RegisterData = {
  firstName: string,
  lastName: string,
  email: string;
  phoneNumber: string,
  password: string;
}

export type LoginData = {
  email: string,
  password: string,
  rememberSession: boolean,
}

export type RegisterResponse = {
  userId: string;
  email: string;
}

export type LoginResponse = {
  userId: string;
  email: string;
}