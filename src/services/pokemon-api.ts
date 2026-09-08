import { API_URL } from "../config/api";

export type Pokemon = {
  id: number;
  nombre: string;
  imagen: string | null;
  tipos: string[];
};

export type PokemonList = {
  limit: number;
  pokemon: string[];
};

export type ApiHealth = {
  status: "ok";
};

type ApiErrorResponse = {
  error?: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  const body = (await response.json()) as T & ApiErrorResponse;

  if (!response.ok) {
    throw new ApiError(body.error || "No fue posible completar la solicitud.", response.status);
  }

  return body;
}

export function checkBackendHealth(): Promise<ApiHealth> {
  return request<ApiHealth>("/health");
}

export function getPokemonByName(nombre: string): Promise<Pokemon> {
  return request<Pokemon>(`/pokemon/${encodeURIComponent(nombre.trim().toLowerCase())}`);
}

export function getPokemonList(limit = 20): Promise<PokemonList> {
  return request<PokemonList>(`/pokemon?limit=${limit}`);
}
