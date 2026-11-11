import { useState } from "react";
import { Link } from "react-router-dom";
import { FormularioCredenciales } from "../components/FormularioCredenciales";
import { registrarConEmail, entrarConGoogle } from "../services/auth";
import { mensajeDeError } from "../utils/mensajesAuth";
import type { Credenciales } from "../types/auth";

export function Registro() {
  const [enviando, setEnviando] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function crearCuenta(credenciales: Credenciales) {
    setError("");
    setEnviando(true);
    try {
      await registrarConEmail(credenciales);
      // Firebase inicia sesion automaticamente al registrar.
    } catch (e: unknown) {
      setError(mensajeDeError(e));
    } finally {
      setEnviando(false);
    }
  }

  async function registrarConGoogle() {
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
      <h1>Crear cuenta</h1>

      <FormularioCredenciales
        textoBoton="Registrarme"
        enviando={enviando}
        onEnviar={crearCuenta}
      />

      <button type="button" onClick={registrarConGoogle} disabled={enviando}>
        Registrarme con Google
      </button>

      {error && <p role="alert">{error}</p>}

      <p>
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </main>
  );
}
