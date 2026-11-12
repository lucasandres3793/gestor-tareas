import { describe, it, expect } from "vitest";
import { mensajeDeError } from "../src/utils/mensajesAuth";

describe("mensajeDeError", () => {
  it("traduce un codigo conocido de Firebase", () => {
    expect(mensajeDeError({ code: "auth/invalid-credential" })).toBe(
      "Email o contraseña incorrectos."
    );
  });

  it("no revela si el email existe (evita la enumeracion de usuarios)", () => {
    const mensaje = mensajeDeError({ code: "auth/invalid-credential" });
    expect(mensaje).not.toContain("existe");
    expect(mensaje).not.toContain("cuenta");
  });

  it("caso borde: codigo desconocido devuelve un mensaje generico", () => {
    expect(mensajeDeError({ code: "auth/codigo-nuevo" })).toBe(
      "No pudimos completar la operación. Intentá de nuevo."
    );
  });

  it("caso borde: un error sin forma de error de Firebase no rompe", () => {
    expect(mensajeDeError("se rompio todo")).toBe(
      "Ocurrió un error inesperado. Intentá de nuevo."
    );
  });
});
