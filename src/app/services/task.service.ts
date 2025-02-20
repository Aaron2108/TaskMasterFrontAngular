import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { ResponseTask } from '../interfaces/ResponseTask';
import { map, Observable } from 'rxjs';
import { Task } from '../interfaces/Task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private baseUrl: string = appsettings.apiUrl;

  constructor() {}

  // Obtener la lista de tareas
  lista(): Observable<ResponseTask> {
    return this.http.get<Task[]>(`${this.baseUrl}tasks`).pipe(
      map(response => ({ value: response }))
    );
  }

  //Obtener una tarea por su ID
  obtenerPorId(id: number): Observable<Task> {
    console.log(`📌 Obteniendo tarea con ID: ${id}`);
    return this.http.get<Task>(`${this.baseUrl}tasks/${id}`);
  }

  //Agregar una nueva tarea
  agregar(tarea: Task): Observable<Task> {
    console.log('✅ Agregando tarea:', tarea);
    return this.http.post<Task>(`${this.baseUrl}tasks`, tarea);
  }

  //Editar una tarea (solo los campos que se envían)
  editar(id: number, tarea: Partial<Task>): Observable<Task> {
    console.log(`✏️ Editando tarea ID ${id}:`, tarea);
    return this.http.put<Task>(`${this.baseUrl}tasks/${id}`, tarea);
  }

  //Eliminar una tarea
  eliminar(id: number): Observable<void> {
    console.log(`🗑 Eliminando tarea con ID: ${id}`);
    return this.http.delete<void>(`${this.baseUrl}tasks/${id}`);
  }
}
