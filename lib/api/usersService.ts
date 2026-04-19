import axios, { AxiosInstance } from 'axios';

export type UserRole = 'ADMIN' | 'EMPLEADO' | 'CURSANTE';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  role?: UserRole;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

class UsersService {
  private api: AxiosInstance;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333') {
    this.api = axios.create({
      baseURL,
      withCredentials: true,
    });
  }

  setToken(token: string): void {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async getUsers(): Promise<User[]> {
    const { data } = await this.api.get('/users');
    return data;
  }

  async getUser(id: string): Promise<User> {
    const { data } = await this.api.get(`/users/${id}`);
    return data;
  }

  async createUser(input: CreateUserDto): Promise<User> {
    const { data } = await this.api.post('/users', input);
    return data;
  }

  async updateUser(id: string, input: UpdateUserDto): Promise<User> {
    const { data } = await this.api.patch(`/users/${id}`, input);
    return data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  async deactivateUser(id: string): Promise<User> {
    const { data } = await this.api.patch(`/users/${id}/deactivate`);
    return data;
  }

  async activateUser(id: string): Promise<User> {
    const { data } = await this.api.patch(`/users/${id}/activate`);
    return data;
  }
}

export default new UsersService();
