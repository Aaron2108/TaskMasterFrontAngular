import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token') || "";
  const router = inject(Router);

  if (token) {
    try {
      // Decodificar el token
      const decodedToken: any = jwtDecode(token);

      // Obtener la fecha de expiración
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos

      if (decodedToken.exp && decodedToken.exp > currentTime) {
        return true; // Token válido
      } else {
        console.warn("El token ha expirado");
        router.navigate([""]); 
        return false;
      }
    } catch (error) {
      console.error("Token inválido:", error);
      router.navigate([""]); 
      return false;
    }
  } else {
    router.navigate([""]); 
    return false;
  }
};
