import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Credenciales } from "../types/auth";
import { validarCredenciales, hayErrores } from "../utils/validaciones";
import type { ErroresCredenciales } from "../utils/validaciones";

interface Props {
  textoBoton: string;
  enviando: boolean;
  onEnviar: (credenciales: Credenciales) => void;
}

const INICIAL: Credenciales = { email: "", password: "" };

export function FormularioCredenciales({ textoBoton, enviando, onEnviar }: Props) {
  const [form, setForm] = useState<Credenciales>(INICIAL);
  const [errores, setErrores] = useState<ErroresCredenciales>({});

  // Handler generico: el atributo name del input decide que campo cambia.
  function cambiar(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const encontrados = validarCredenciales(form);
    setErrores(encontrados);

    // Si hay errores, no se envia nada.
    if (hayErrores(encontrados)) return;

    onEnviar(form);
  }

  return (
    <form onSubmit={enviar} noValidate>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={cambiar}
          disabled={enviando}
          autoComplete="email"
        />
        {errores.email && <p role="alert">{errores.email}</p>}
      </div>

      <div>
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={cambiar}
          disabled={enviando}
          autoComplete="current-password"
        />
        {errores.password && <p role="alert">{errores.password}</p>}
      </div>

      <button type="submit" disabled={enviando}>
        {enviando ? "Enviando..." : textoBoton}
      </button>
    </form>
  );
}
