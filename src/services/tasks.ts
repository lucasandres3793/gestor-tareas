import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import type { QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from "./firebase";
import type { Task, TaskInput } from "../types/task";

const COLECCION = "tasks";

// Escucha en tiempo real las tareas del usuario.
// Devuelve la funcion para cancelar la suscripcion.
export function escucharTareas(
  userId: string,
  alRecibir: (tareas: Task[]) => void,
  alFallar: (error: Error) => void
): () => void {
  const consulta = query(
    collection(db, COLECCION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    consulta,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const tareas: Task[] = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...(documento.data() as Omit<Task, "id">),
      }));
      alRecibir(tareas);
    },
    alFallar
  );
}

export function crearTarea(userId: string, entrada: TaskInput): Promise<unknown> {
  return addDoc(collection(db, COLECCION), {
    ...entrada,
    userId,
    completed: false,
    createdAt: serverTimestamp(),
  });
}

export function editarTarea(taskId: string, cambios: Partial<TaskInput>): Promise<void> {
  return updateDoc(doc(db, COLECCION, taskId), cambios);
}

export function alternarCompletada(taskId: string, actual: boolean): Promise<void> {
  return updateDoc(doc(db, COLECCION, taskId), { completed: !actual });
}

export function borrarTarea(taskId: string): Promise<void> {
  return deleteDoc(doc(db, COLECCION, taskId));
}
