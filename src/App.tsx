import { useCallback, useEffect, useMemo, useState } from "react";
import { API_URL } from "./config/api";
import {
  ApiError,
  checkBackendHealth,
  getPokemonByName,
  getPokemonList,
  type Pokemon,
} from "./services/pokemon-api";
import { SearchBar } from "./components/SearchBar";

const POKEMON_LIMIT = 20;
const POKEMON_PER_PAGE = 6;

type LoadState = "idle" | "loading" | "success" | "error";
type ConnectionState = "checking" | "connected" | "error";

function formatPokemonName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError || error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export default function App() {
  const [connectionState, setConnectionState] = useState<ConnectionState>("checking");
  const [pokemonNames, setPokemonNames] = useState<string[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [selectedName, setSelectedName] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [listState, setListState] = useState<LoadState>("idle");
  const [detailState, setDetailState] = useState<LoadState>("idle");
  const [listError, setListError] = useState<string>("");
  const [detailError, setDetailError] = useState<string>("");

  const hasPokemon = pokemonNames.length > 0;
  const totalPages = Math.max(1, Math.ceil(pokemonNames.length / POKEMON_PER_PAGE));
  const visiblePokemonNames = useMemo(() => {
    const firstPokemon = (currentPage - 1) * POKEMON_PER_PAGE;
    return pokemonNames.slice(firstPokemon, firstPokemon + POKEMON_PER_PAGE);
  }, [currentPage, pokemonNames]);

  const firstType = useMemo(() => selectedPokemon?.tipos[0] ?? "normal", [selectedPokemon]);

  const loadPokemonDetail = useCallback(async (name: string) => {
    setSelectedName(name);
    setDetailState("loading");
    setDetailError("");

    try {
      const pokemon = await getPokemonByName(name);
      setSelectedPokemon(pokemon);
      setDetailState("success");
    } catch (error) {
      setSelectedPokemon(null);
      setDetailError(getErrorMessage(error, "No fue posible cargar la ficha del Pokemon."));
      setDetailState("error");
    }
  }, []);

  const loadPokemonList = useCallback(async () => {
    setListState("loading");
    setListError("");
    setDetailError("");

    try {
      const data = await getPokemonList(POKEMON_LIMIT);
      setPokemonNames(data.pokemon);
      setCurrentPage(1);
      setListState("success");

      if (data.pokemon.length > 0) {
        await loadPokemonDetail(data.pokemon[0]);
      } else {
        setSelectedName("");
        setSelectedPokemon(null);
        setDetailState("idle");
      }
    } catch (error) {
      setPokemonNames([]);
      setSelectedName("");
      setSelectedPokemon(null);
      setListError(getErrorMessage(error, "No fue posible cargar el listado de Pokemon."));
      setListState("error");
      setDetailState("idle");
    }
  }, [loadPokemonDetail]);

  useEffect(() => {
    checkBackendHealth()
      .then(() => setConnectionState("connected"))
      .catch(() => setConnectionState("error"));

    void loadPokemonList();
  }, [loadPokemonList]);

  return (
    <main className="pokedex-shell">
      <div className="case-controls" aria-hidden="true">
        <span className="case-direction-pad" />
        <span className="case-system-button" />
        <span className="case-system-button" />
        <span className="case-action-button">B</span>
        <span className="case-action-button">A</span>
      </div>

      <section className="catalog-panel" aria-labelledby="catalog-title">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Catalogo</p>
            <div className="brand-lockup">
              <span className="pokeball-icon" aria-hidden="true">
                <span />
              </span>
              <h1 id="catalog-title">Pokédex</h1>
            </div>
            <p className="backend-status">
              Backend: {API_URL} | Estado: {connectionState === "checking" && "comprobando..."}
              {connectionState === "connected" && "conectado"}
              {connectionState === "error" && "no disponible"}
            </p>
          </div>

          <button
            className="reload-button"
            type="button"
            onClick={() => void loadPokemonList()}
            disabled={listState === "loading"}
          >
            {listState === "loading" ? "Cargando..." : "Recargar"}
          </button>
        </div>

        <SearchBar onSearch={(name) => void loadPokemonDetail(name)} isLoading={detailState === "loading"} />

        {listState === "error" && (
          <div className="message error-message" role="alert">
            <strong>No se pudo cargar el catalogo.</strong>
            <span>{listError}</span>
          </div>
        )}

        {listState === "loading" && !hasPokemon && (
          <div className="message" role="status" aria-live="polite">
            Cargando listado de Pokemon...
          </div>
        )}

        {listState === "success" && !hasPokemon && (
          <div className="message empty-message" role="status">
            No hay Pokemon para mostrar.
          </div>
        )}

        {hasPokemon && (
          <>
            <ul className="pokemon-grid" aria-label="Listado de Pokemon">
              {visiblePokemonNames.map((name) => (
                <li key={name}>
                  <button
                    className={`pokemon-list-button ${selectedName === name ? "is-selected" : ""}`}
                    type="button"
                    onClick={() => void loadPokemonDetail(name)}
                    aria-pressed={selectedName === name}
                  >
                    <span>{formatPokemonName(name)}</span>
                  </button>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <nav className="pagination" aria-label="Paginación del catálogo">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => page - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <span aria-live="polite">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => page + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </nav>
            )}
          </>
        )}
      </section>

      <section className={`detail-panel type-${firstType}`} aria-labelledby="detail-title">
        <p className="eyebrow">Ficha</p>
        <h2 id="detail-title">
          {selectedPokemon ? formatPokemonName(selectedPokemon.nombre) : "Selecciona un Pokemon"}
        </h2>

        {detailState === "idle" && (
          <div className="detail-placeholder">
            Elige un nombre del catalogo para ver su imagen, numero y tipos.
          </div>
        )}

        {detailState === "loading" && (
          <div className="detail-placeholder" role="status" aria-live="polite">
            Cargando ficha de {formatPokemonName(selectedName)}...
          </div>
        )}

        {detailState === "error" && (
          <div className="message error-message" role="alert">
            <strong>No se pudo cargar la ficha.</strong>
            <span>{detailError}</span>
          </div>
        )}

        {detailState === "success" && selectedPokemon && (
          <article className="pokemon-detail-card">
            <span className="pokemon-id">#{String(selectedPokemon.id).padStart(3, "0")}</span>

            <div className="pokemon-image-frame">
              {selectedPokemon.imagen ? (
                <img
                  src={selectedPokemon.imagen}
                  alt={`Ilustracion de ${formatPokemonName(selectedPokemon.nombre)}`}
                />
              ) : (
                <span>Sin imagen disponible</span>
              )}
            </div>

            <div className="type-list" aria-label="Tipos de Pokemon">
              {selectedPokemon.tipos.map((type) => (
                <span className={`type-badge type-${type}`} key={type}>
                  {formatPokemonName(type)}
                </span>
              ))}
            </div>

          </article>
        )}
      </section>
    </main>
  );
}
