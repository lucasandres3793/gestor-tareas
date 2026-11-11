import { useState } from "react";
import { Link } from "react-router-dom";
import { FormularioCredenciales } from "../components/FormularioCredenciales";
import { entrarConEmail, entrarConGoogle } from "../services/auth";
import { mensajeDeError } from "../utils/mensajesAuth";
import type { Credenciales } from "../types/auth";

export function Login() {
  const [enviando, setEnviando] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function iniciarSesion(credenciales: Credenciales) {
    setError("");
    setEnviando(true);
    try {
      await entrarConEmail(credenciales);
      // No navegamos a mano: al cambiar la sesion, las rutas reaccionan solas.
    } catch (e: unknown) {
      setError(mensajeDeError(e));
    } finally {
      setEnviando(false);
    }
  }

  async function iniciarConGoogle() {
    setError("");
    setEnviando(true);
    try {
      await entrarConGoogle();
    } catch (e: unknown) {
      setError(mensajeDeError(e));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main>
      <h1>Iniciar sesión</h1>

      <FormularioCredenciales
        textoBoton="Entrar"
        enviando={enviando}
        onEnviar={iniciarSesion}
      />

      <button type="button" onClick={iniciarConGoogle} disabled={enviando}>
        Entrar con Google
      </button>

      {error && <p role="alert">{error}</p>}

      <p>
        ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
      </p>
    </main>
  );
}
