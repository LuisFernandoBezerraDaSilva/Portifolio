const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export class BaseService<T> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async getAll(): Promise<T[]> {
    const res = await fetch(`${baseUrl}/${this.endpoint}`);
    if (!res.ok) throw new Error("Erro ao buscar dados");
    return res.json();
  }

  async get(id: string): Promise<T> {
    const res = await fetch(`${baseUrl}/${this.endpoint}/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar item");
    return res.json();
  }

  async create(item: T): Promise<T> {
    const res = await fetch(`${baseUrl}/${this.endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error("Erro ao criar item");
    return res.json();
  }

  async update(id: string, item: T): Promise<T> {
    const res = await fetch(`${baseUrl}/${this.endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error("Erro ao atualizar item");
    return res.json();
  }

  async delete(id: string): Promise<void> {
    const res = await fetch(`${baseUrl}/${this.endpoint}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Erro ao deletar item");
  }
}