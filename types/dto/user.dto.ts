export interface UserDTO {
  id: string;
  name: string;
  email: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}
