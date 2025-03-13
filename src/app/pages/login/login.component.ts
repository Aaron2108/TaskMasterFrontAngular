import { Component, inject } from '@angular/core';
import { AccesoService } from '../../services/acceso.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../interfaces/Login';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private accesoService = inject(AccesoService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formLogin: FormGroup = this.formBuild.group({
    email: ['', [Validators.required, Validators.email]], //Valida datos requeridos
    password: ['', [Validators.required, Validators.minLength(8)]] 
  });

  // Método para verificar si un campo es inválido
  campoInvalido(campo: string): boolean {
    return this.formLogin.controls[campo].invalid && this.formLogin.controls[campo].touched;
  }

  iniciarSesion() {
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched(); // Marca todos los campos como tocados
      return;
    }


    const objeto: Login = {
      email: this.formLogin.get('email')?.value, // Accede de manera segura a los valores
      password: this.formLogin.get('password')?.value
    };

    this.accesoService.login(objeto).subscribe({
      next:(data) =>{
        if(data.email){
          localStorage.setItem('token', data.token);
          this.router.navigate(['inicio'])
        }else{
          alert("Credenciales incorrectas")
        }
      },
      error:(error) =>{
        console.log(error.message);
        alert("Error al iniciar sesión. Intente de nuevo.")
      }
    })
  }
  registrarse(){
    this.router.navigate(['registro'])
  }

}
