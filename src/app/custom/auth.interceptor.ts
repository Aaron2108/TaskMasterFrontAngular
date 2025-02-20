import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.toLowerCase().includes('acceso')) {
    return next(req);
  }

  const token = localStorage.getItem("token");
  
  const clonRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}` 
    }
  });

  return next(clonRequest);
};