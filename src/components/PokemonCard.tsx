export interface PokemonData {
  id: number;
  nombre: string;
  imagen: string | null;
  tipos: string[];
}

interface PokemonCardProps {
  pokemon: PokemonData;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <div className="pokemon-card">
      <div className="card-header">
        <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>
        <h2>{pokemon.nombre.toUpperCase()}</h2>
      </div>
      
      <div className="image-container">
        {/* Aquí agregamos || undefined para solucionar el error de TypeScript */}
        <img 
          src={pokemon.imagen || undefined} 
          alt={`Imagen de ${pokemon.nombre}`} 
        />
      </div>

      <div className="types-container">
        {pokemon.tipos.map((tipo) => (
          <span key={tipo} className={`type-badge type-${tipo}`}>
            {tipo}
          </span>
        ))}
      </div>
    </div>
  );
}