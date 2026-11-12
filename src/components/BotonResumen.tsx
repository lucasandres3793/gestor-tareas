import { useState } from "react";
import { enviarResumen } from "../services/email";
import { armarResumen } from "../utils/resumenTareas";
import type { Task } from "../types/task";

type Estado = "idle" | "enviando" | "ok" | "error";

interface Props {
  tareas: Task[];
  email: string;
}

export function BotonResumen({ tareas, email }: Props) {
  const [estado, setEstado] = useState<Estado>("idle");
  const [mensaje, setMensaje] = useState<string>("");

  async function enviar() {
    // Bloquear antes de salir a la red: evita el doble envio.
    setEstado("enviando");
    setMensaje("");

    try {
      const resumen = armarResumen(tareas);
      await enviarResumen(email, resumen);
      setEstado("ok");
      setMensaje(`Te enviamos el resumen a ${email}.`);
    } catch (e: unknown) {
      setEstado("error");
      setMensaje(e instanceof Error ? e.message : "No pudimos enviar el email.");
    }
  }

  return (
    <div>
      <button type="button" onClick={enviar} disabled={estado === "enviando"}>
        {estado === "enviando" ? "Enviando..." : "Enviarme el resumen por email"}
      </button>

      {mensaje && (
        <p role={estado === "error" ? "alert" : "status"}>{mensaje}</p>
      )}
    </div>
  );
}
