import { fetchWithAuth } from "../helpers/fetchWithAuth";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300";


function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export class BaseService<T> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async getAll(): Promise<T[]> {
    const res = await fetchWithAuth(`${baseUrl}/${this.endpoint}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Erro ao buscar dados");
    return res.json();
  }

  async get(id: string): Promise<T> {
    const res = await fetchWithAuth(`${baseUrl}/${this.endpoint}/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Erro ao buscar item");
    return res.json();
  }

  async create(item: T, endpoint?: string): Promise<T> {
    const url = endpoint
      ? `${baseUrl}/${endpoint}`
      : `${baseUrl}/${this.endpoint}`;
    const res = await fetchWithAuth(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error("Erro ao criar item");
    return res.json();
  }

  async update(id: string, item: T): Promise<T> {
    const res = await fetchWithAuth(`${baseUrl}/${this.endpoint}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error("Erro ao atualizar item");
    return res.json();
  }

  async delete(id: string): Promise<void> {
    const res = await fetchWithAuth(`${baseUrl}/${this.endpoint}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Erro ao deletar item");
  }
}