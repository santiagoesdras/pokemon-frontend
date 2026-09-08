import { useState, type FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (nombre: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanInput = inputValue.trim().toLowerCase();
    
    // Validación básica: no buscar si está vacío
    if (cleanInput.length > 0) {
      onSearch(cleanInput);
      setInputValue(''); // Limpiar el input después de buscar
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        placeholder="Busca un Pokémon por nombre..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading || !inputValue.trim()}>
        {isLoading ? 'Buscando...' : 'Buscar'}
      </button>
    </form>
  );
}