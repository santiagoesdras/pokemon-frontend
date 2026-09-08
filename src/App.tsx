import { useEffect, useState } from "react";
import { API_URL } from "./config/api";
import { checkBackendHealth, getPokemonByName } from "./services/pokemon-api";
import { SearchBar } from "./components/SearchBar";
import { PokemonCard, type PokemonData } from "./components/PokemonCard";

type ConnectionState = "checking" | "connected" | "error";

export default function App() {
  const [connectionState, setConnectionState] = useState<ConnectionState>("checking");
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    checkBackendHealth()
      .then(() => setConnectionState("connected"))
      .catch(() => setConnectionState("error"));
  }, []);

  const handleSearch = async (nombre: string) => {
    setLoading(true);
    setSearchError(null);
    setPokemon(null);

    try {
      const data = await getPokemonByName(nombre);
      setPokemon(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setSearchError("No se encontró el Pokémon. Intenta con otro nombre.");
      } else {
        setSearchError("Error de conexión al buscar el Pokémon.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Pokédex App</h1>
        <p>
          Backend: {API_URL} | Estado: {connectionState === "checking" && "comprobando..."}
          {connectionState === "connected" && "conectado"}
          {connectionState === "error" && "no disponible"}
        </p>
      </header>

      <SearchBar onSearch={handleSearch} isLoading={loading} />

      <section style={{ marginTop: "1.5rem" }}>
        {loading && <p className="loading-text">Cargando datos...</p>}
        
        {searchError && <p className="error-message">{searchError}</p>}
        
        {pokemon && !loading && !searchError && (
          <PokemonCard pokemon={pokemon} />
        )}
      </section>
    </div>
  );
}