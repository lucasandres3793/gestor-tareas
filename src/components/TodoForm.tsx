import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { TaskInput, Prioridad } from "../types/task";

interface Props {
  valorInicial?: TaskInput;
  textoBoton?: string;
  enviando: boolean;
  onEnviar: (entrada: TaskInput) => void;
  onCancelar?: () => void;
}

const VACIO: TaskInput = {
  title: "",
  description: "",
  priority: "media",
  dueDate: null,
};

export function TodoForm({
  valorInicial,
  textoBoton = "Agregar tarea",
  enviando,
  onEnviar,
  onCancelar,
}: Props) {
  const [form, setForm] = useState<TaskInput>(valorInicial ?? VACIO);
  const [error, setError] = useState<string>("");

  function cambiar(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "dueDate" && value === "" ? null : value,
    }));
  }

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const titulo = form.title.trim();
    if (titulo === "") {
      setError("El título es obligatorio.");
      return;
    }

    setError("");
    onEnviar({ ...form, title: titulo, description: form.description.trim() });

    // Solo limpia al crear, no al editar.
    if (valorInicial === undefined) {
      setForm(VACIO);
    }
  }

  return (
    <form onSubmit={enviar} noValidate>
      <div>
        <label htmlFor="title">Título</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={cambiar}
          disabled={enviando}
          maxLength={100}
        />
      </div>

      <div>
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={cambiar}
          disabled={enviando}
          rows={2}
        />
      </div>

      <div>
        <label htmlFor="priority">Prioridad</label>
        <select
          id="priority"
          name="priority"
          value={form.priority}
          onChange={cambiar}
          disabled={enviando}
        >
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      <div>
        <label htmlFor="dueDate">Vence</label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={form.dueDate ?? ""}
          onChange={cambiar}
          disabled={enviando}
        />
      </div>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={enviando}>
        {enviando ? "Guardando..." : textoBoton}
      </button>

      {onCancelar && (
        <button type="button" onClick={onCancelar} disabled={enviando}>
          Cancelar
        </button>
      )}
    </form>
  );
}
