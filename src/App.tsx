import { useEffect, useState } from "react";
import { API_URL } from "./config/api";
import { checkBackendHealth } from "./services/pokemon-api";

type ConnectionState = "checking" | "connected" | "error";

export default function App() {
  const [connectionState, setConnectionState] = useState<ConnectionState>("checking");

  useEffect(() => {
    checkBackendHealth()
      .then(() => setConnectionState("connected"))
      .catch(() => setConnectionState("error"));
  }, []);

  return (
    <main>
      <h1>Pokedex App</h1>
      <p>Base técnica del frontend lista para integrar las funcionalidades del equipo.</p>
      <p>Backend: {API_URL}</p>
      <p>
        Estado de conexión: {connectionState === "checking" && "comprobando..."}
        {connectionState === "connected" && "conectado"}
        {connectionState === "error" && "no disponible"}
      </p>
    </main>
  );
}
