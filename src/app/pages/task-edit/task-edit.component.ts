import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../interfaces/Task';
import { SwitchService } from '../../services/switch.service';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.css'
})
export class TaskEditComponent {
  constructor(private modalSS: SwitchService) {}

  private taskService = inject(TaskService);


  // 📌 Recibir la tarea seleccionada desde el componente padre
  @Input() tareaSeleccionada: Task = {
    title: '',
    description: '',
    fecha_vencimiento: new Date(),
    estado: true, 
  };


  closeModal() {
    this.modalSS.$modal.emit(false);
  }

  // 📌 Método para actualizar la tarea
  guardarCambios() {
    if (!this.tareaSeleccionada.id) {
      console.error("❌ No se puede actualizar una tarea sin ID.");
      alert("Error: La tarea seleccionada no tiene un ID válido.");
      return;
    }
  
    if (!this.tareaSeleccionada.title || !this.tareaSeleccionada.description || !this.tareaSeleccionada.fecha_vencimiento) {
      alert("Todos los campos son obligatorios");
      return;
    }
  
    const fechaVencimiento = new Date(this.tareaSeleccionada.fecha_vencimiento);
    if (isNaN(fechaVencimiento.getTime())) {
      alert("⚠ Fecha inválida");
      return;
    }
  
    const tareaActualizada: Partial<Task> = {
      title: this.tareaSeleccionada.title,
      description: this.tareaSeleccionada.description,
      fecha_vencimiento: new Date(this.tareaSeleccionada.fecha_vencimiento), 
      estado: Boolean(this.tareaSeleccionada.estado),
    };
    
  
    this.taskService.editar(this.tareaSeleccionada.id, tareaActualizada).subscribe({
      next: (response) => {
        console.log("✅ Tarea actualizada con éxito", response);
        this.closeModal();
        window.location.reload();

      },
      error: (error) => console.error("❌ Error al actualizar la tarea:", error),
    });
  }
  
  
  
}
