import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./firebase";
import type { Credenciales } from "../types/auth";

const googleProvider = new GoogleAuthProvider();

export function registrarConEmail({ email, password }: Credenciales): Promise<unknown> {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function entrarConEmail({ email, password }: Credenciales): Promise<unknown> {
  return signInWithEmailAndPassword(auth, email, password);
}

export function entrarConGoogle(): Promise<unknown> {
  return signInWithPopup(auth, googleProvider);
}

export function cerrarSesion(): Promise<void> {
  return signOut(auth);
}

// Observer: Firebase avisa cada vez que cambia la sesión.
// Devuelve la función para desuscribirse.
export function escucharSesion(alCambiar: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, alCambiar);
}
