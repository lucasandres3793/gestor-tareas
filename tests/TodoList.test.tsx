import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoList } from "../src/components/TodoList";
import { BotonResumen } from "../src/components/BotonResumen";
import { enviarResumen } from "../src/services/email";
import type { Task } from "../src/types/task";

// El servicio de email se simula: ningun test sale a la red ni toca AWS.
vi.mock("../src/services/email", () => ({
  enviarResumen: vi.fn(),
}));

const tareas: Task[] = [
  {
    id: "1",
    userId: "u1",
    title: "Comprar pan",
    description: "En la panaderia",
    completed: false,
    priority: "alta",
    dueDate: "2026-12-20",
    createdAt: null,
  },
  {
    id: "2",
    userId: "u1",
    title: "Pagar luz",
    description: "",
    completed: true,
    priority: "baja",
    dueDate: null,
    createdAt: null,
  },
];

const handlers = {
  onAlternar: vi.fn(),
  onEditar: vi.fn(),
  onBorrar: vi.fn(),
};

describe("TodoList", () => {
  it("muestra el estado de carga", () => {
    render(<TodoList tareas={[]} cargando={true} error="" {...handlers} />);
    expect(screen.getByText("Cargando tareas...")).toBeInTheDocument();
  });

  it("caso borde: muestra el error cuando falla la lectura", () => {
    render(
      <TodoList tareas={[]} cargando={false} error="No pudimos cargar tus tareas." {...handlers} />
    );
    expect(screen.getByRole("alert")).toHaveTextContent("No pudimos cargar tus tareas.");
  });

  it("caso borde: avisa cuando la lista esta vacia", () => {
    render(<TodoList tareas={[]} cargando={false} error="" {...handlers} />);
    expect(screen.getByText(/no tenés tareas todavía/i)).toBeInTheDocument();
  });

  it("lista las tareas con su prioridad y vencimiento", () => {
    render(<TodoList tareas={tareas} cargando={false} error="" {...handlers} />);
    expect(screen.getByText("Comprar pan")).toBeInTheDocument();
    expect(screen.getByText("Pagar luz")).toBeInTheDocument();
    expect(screen.getByText(/Prioridad: alta/)).toBeInTheDocument();
    expect(screen.getByText(/Vence: 2026-12-20/)).toBeInTheDocument();
  });

  it("avisa al padre cuando se marca una tarea como completada", async () => {
    render(<TodoList tareas={tareas} cargando={false} error="" {...handlers} />);

    await userEvent.click(
      screen.getByRole("checkbox", { name: /marcar "comprar pan" como completada/i })
    );

    expect(handlers.onAlternar).toHaveBeenCalledWith(tareas[0]);
  });
});

describe("BotonResumen", () => {
  beforeEach(() => {
    vi.mocked(enviarResumen).mockReset();
  });

  it("confirma al usuario cuando el envio sale bien", async () => {
    vi.mocked(enviarResumen).mockResolvedValue({ ok: true });

    render(<BotonResumen tareas={tareas} email="lucas@ejemplo.com" />);
    await userEvent.click(screen.getByRole("button", { name: /enviarme el resumen/i }));

    expect(enviarResumen).toHaveBeenCalledWith(
      "lucas@ejemplo.com",
      expect.stringContaining("Comprar pan")
    );
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Te enviamos el resumen a lucas@ejemplo.com."
    );
  });

  it("caso borde: muestra el error cuando el envio falla", async () => {
    vi.mocked(enviarResumen).mockRejectedValue(new Error("No pudimos enviar el email."));

    render(<BotonResumen tareas={tareas} email="lucas@ejemplo.com" />);
    await userEvent.click(screen.getByRole("button", { name: /enviarme el resumen/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("No pudimos enviar el email.");
  });
});
