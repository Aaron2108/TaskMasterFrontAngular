import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccesoService } from '../../services/acceso.service';
import { Router } from '@angular/router';
import { Usuario } from '../../interfaces/Usuario';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

    private accesoService = inject(AccesoService);
    private router = inject(Router);
    public formBuild = inject(FormBuilder);
  
    public formRegistro: FormGroup = this.formBuild.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(8)]] 
    });

    // Método para verificar si un campo es inválido
  campoInvalido(campo: string): boolean {
    return this.formRegistro.controls[campo].invalid && this.formRegistro.controls[campo].touched;}

    registrarse() {
      if (this.formRegistro.invalid) {
        this.formRegistro.markAllAsTouched(); 
        return;
      }

      const objeto: Usuario = {
        email: this.formRegistro.get('email')?.value,
        password: this.formRegistro.get('password')?.value
      };

      console.log("Datos enviados:", objeto);

      this.accesoService.registrarse(objeto).subscribe({
        next:(data) =>{
          if (data?.message === "User registered successfully") { 
            alert("Registro exitoso");
            this.router.navigate(['']);
          }else{
            alert("Ya esta registrado")
          }
        },
        error:(error) =>{
          console.log(error.message);
          alert("Error al registrar sesión. Intente de nuevo.");
        }
      })
    }

    volver(){
      this.router.navigate([""]);
    }


}
