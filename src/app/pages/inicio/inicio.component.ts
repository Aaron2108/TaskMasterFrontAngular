import { CommonModule, DatePipe } from '@angular/common';
import { Task } from '../../interfaces/Task';
import { TaskService } from './../../services/task.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskEditComponent } from "../task-edit/task-edit.component";
import { SwitchService } from '../../services/switch.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, TaskEditComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {
  private taskService = inject(TaskService);
  public listaTask: Task[] = [];
  public listaFiltrada: Task[] = [];
  
  modalSwitch: boolean = false;
  tareaSeleccionada: Task | null = null;
  filtroEstado: string = 'todos';
  ordenFecha: string = 'asc';

  constructor(private modalSS: SwitchService) {}

  public nuevaTarea: Task = {
    title: '',
    description: '',
    fecha_vencimiento: new Date(),
    estado: true,
  };

  ngOnInit() {
    this.obtenerTareas();
    this.modalSS.$modal.subscribe((valor) => { this.modalSwitch = valor; });
  }

  openModal(tarea?: Task) {
    if (tarea) {
      this.tareaSeleccionada = { ...tarea,
        
        estado: Number(tarea.estado) === 1
       };
    }
    this.modalSwitch = true;
  }

  obtenerTareas() {
    this.taskService.lista().subscribe({
      next: (response) => {
        console.log('✅ Respuesta del servidor:', response);
        if (response?.value && response.value.length > 0) {
          this.listaTask = response.value.map(tarea => ({
            ...tarea,
            fecha_vencimiento: new Date(tarea.fecha_vencimiento),
            estado: Number(tarea.estado) === 1  // Convierte a número antes de comparar.
          }));
        } else {
          this.listaTask = [];
        }
        this.filtrarTareas();
      },
      error: (error) => {
        console.error('❌ Error al obtener las tareas:', error);
        this.listaTask = [];
      }
    });
  }
  

  agregarTarea() {
    if (!this.nuevaTarea.title || !this.nuevaTarea.description || !this.nuevaTarea.fecha_vencimiento) {
      alert("⚠ Todos los campos son obligatorios");
      return;
    }

    const fechaVencimiento = new Date(this.nuevaTarea.fecha_vencimiento);
    if (isNaN(fechaVencimiento.getTime())) {
      alert("⚠ Fecha inválida");
      return;
    }

    const estadoBoolean = Boolean(this.nuevaTarea.estado);
    const tareaNueva: Task = {
      title: this.nuevaTarea.title,
      description: this.nuevaTarea.description,
      fecha_vencimiento: fechaVencimiento,
      estado: estadoBoolean
    };

    this.taskService.agregar(tareaNueva).subscribe({
      next: (response) => {
        console.log('✅ Tarea agregada con éxito:', response);
        this.listaTask.push(response);
        this.filtrarTareas();
        this.resetFormulario();
      },
      error: (error) => console.error('❌ Error al agregar la tarea:', error)
    });
  }

  eliminarTarea(id: number) {
    if (confirm('🗑 ¿Seguro que deseas eliminar esta tarea?')) {
      this.taskService.eliminar(id).subscribe({
        next: () => {
          console.log(`✅ Tarea ${id} eliminada`);
          this.listaTask = this.listaTask.filter(tarea => tarea.id !== id);
          this.filtrarTareas();
        },
        error: (error) => console.error('❌ Error al eliminar tarea:', error)
      });
    }
  }

  filtrarTareas() {
    if (this.filtroEstado === 'todos') {
      this.listaFiltrada = [...this.listaTask];
    } else {
      const estadoBoolean = this.filtroEstado === 'true';
      this.listaFiltrada = this.listaTask.filter(tarea => tarea.estado === estadoBoolean);
    }
    this.ordenarTareas();
  }

  ordenarTareas() {
    this.listaFiltrada.sort((a, b) => {
      const fechaA = new Date(a.fecha_vencimiento).getTime();
      const fechaB = new Date(b.fecha_vencimiento).getTime();
      return this.ordenFecha === 'asc' ? fechaB - fechaA : fechaA - fechaB;
    });
  }

  resetFormulario() {
    this.nuevaTarea = {
      title: '',
      description: '',
      fecha_vencimiento: new Date(),
      estado: true,
    };
  }
  logout() {
    localStorage.removeItem('token');
    window.location.reload(); 
  }
  
}
