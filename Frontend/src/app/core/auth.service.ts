import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from '../../environments/environment';
import { tap } from "rxjs";

@Injectable({ providedIn: 'root'})
export class AuthService {
  private readonly tokenKey = 'access_token';
  readonly isLoggedIn = signal(!!localStorage.getItem(this.tokenKey));

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  iniciarSesion(email: string, password: string) {
    return this.http
    .post<{ access_token: string }>(`${environment.apiUrl}/auth/inicio-sesion`, {
      email,
      password,
    })
    .pipe(
      tap((respuesta) =>{
        localStorage.setItem(this.tokenKey, respuesta.access_token);
        this.isLoggedIn.set(true);
      })
    );
  }

  cerrarSesion() {
    this.http.post(`${environment.apiUrl}/auth/cerrar-sesion`, {}).subscribe({
      error: () => undefined,
    });
    this.isLoggedIn.set(false);
    this.router.navigateByUrl('/login');
  }

  obtenerToken() {
    return localStorage.getItem(this.tokenKey);
  }
}
