import axios, { AxiosInstance } from 'axios';

export interface DatosBancarios {
  id: string;
  alias: string;
  cbu: string;
  numeroCuenta: string;
  titular: string;
  nombreBanco: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDatosBancariosDto {
  alias: string;
  cbu: string;
  numeroCuenta: string;
  titular: string;
  nombreBanco: string;
}

export interface UpdateDatosBancariosDto {
  alias?: string;
  cbu?: string;
  numeroCuenta?: string;
  titular?: string;
  nombreBanco?: string;
}

class DatosBancariosService {
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

  async getAll(): Promise<DatosBancarios[]> {
    const { data } = await this.api.get('/datos-bancarios');
    return data;
  }

  async getActivo(): Promise<DatosBancarios | null> {
    const { data } = await this.api.get('/datos-bancarios/activo');
    return data;
  }

  async getById(id: string): Promise<DatosBancarios> {
    const { data } = await this.api.get(`/datos-bancarios/${id}`);
    return data;
  }

  async create(input: CreateDatosBancariosDto): Promise<DatosBancarios> {
    const { data } = await this.api.post('/datos-bancarios', input);
    return data;
  }

  async update(id: string, input: UpdateDatosBancariosDto): Promise<DatosBancarios> {
    const { data } = await this.api.patch(`/datos-bancarios/${id}`, input);
    return data;
  }

  async delete(id: string): Promise<void> {
    await this.api.delete(`/datos-bancarios/${id}`);
  }

  async activate(id: string): Promise<DatosBancarios> {
    const { data } = await this.api.patch(`/datos-bancarios/${id}/activate`);
    return data;
  }

  async deactivate(id: string): Promise<DatosBancarios> {
    const { data } = await this.api.patch(`/datos-bancarios/${id}/deactivate`);
    return data;
  }
}

export default new DatosBancariosService();