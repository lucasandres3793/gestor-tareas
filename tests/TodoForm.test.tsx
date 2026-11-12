import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoForm } from "../src/components/TodoForm";

describe("TodoForm", () => {
  it("envia el titulo y la descripcion que escribe el usuario", async () => {
    const onEnviar = vi.fn();
    render(<TodoForm enviando={false} onEnviar={onEnviar} />);

    await userEvent.type(screen.getByLabelText("Título"), "Comprar pan");
    await userEvent.type(screen.getByLabelText("Descripción"), "En la panaderia");
    await userEvent.click(screen.getByRole("button", { name: /agregar tarea/i }));

    expect(onEnviar).toHaveBeenCalledWith({
      title: "Comprar pan",
      description: "En la panaderia",
      priority: "media",
      dueDate: null,
    });
  });

  it("caso borde: no envia y avisa si el titulo esta vacio", async () => {
    const onEnviar = vi.fn();
    render(<TodoForm enviando={false} onEnviar={onEnviar} />);

    await userEvent.click(screen.getByRole("button", { name: /agregar tarea/i }));

    expect(onEnviar).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("El título es obligatorio.");
  });

  it("caso borde: un titulo de solo espacios tampoco pasa", async () => {
    const onEnviar = vi.fn();
    render(<TodoForm enviando={false} onEnviar={onEnviar} />);

    await userEvent.type(screen.getByLabelText("Título"), "   ");
    await userEvent.click(screen.getByRole("button", { name: /agregar tarea/i }));

    expect(onEnviar).not.toHaveBeenCalled();
  });

  it("bloquea el boton mientras se guarda para evitar el doble envio", () => {
    render(<TodoForm enviando={true} onEnviar={vi.fn()} />);
    expect(screen.getByRole("button", { name: /guardando/i })).toBeDisabled();
  });
});
