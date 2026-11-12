import { describe, it, expect } from "vitest";
import { validarCredenciales, hayErrores } from "../src/utils/validaciones";

describe("validarCredenciales", () => {
  it("acepta credenciales validas", () => {
    const errores = validarCredenciales({ email: "lucas@ejemplo.com", password: "123456" });
    expect(hayErrores(errores)).toBe(false);
  });

  it("marca el email vacio", () => {
    const errores = validarCredenciales({ email: "   ", password: "123456" });
    expect(errores.email).toBe("El email es obligatorio.");
  });

  it("marca un email sin arroba", () => {
    const errores = validarCredenciales({ email: "lucas", password: "123456" });
    expect(errores.email).toBe("Ingresá un email válido.");
  });

  it("caso borde: rechaza una contraseña de 5 caracteres", () => {
    const errores = validarCredenciales({ email: "lucas@ejemplo.com", password: "12345" });
    expect(errores.password).toBe("La contraseña debe tener al menos 6 caracteres.");
  });

  it("caso borde: acepta una contraseña de exactamente 6 caracteres", () => {
    const errores = validarCredenciales({ email: "lucas@ejemplo.com", password: "123456" });
    expect(errores.password).toBeUndefined();
  });
});
