import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <header class="topbar">
      <strong>Portal ETUP</strong>
      <button type="button" (click)="auth.cerrarSesion()">Cerrar sesión</button>
    </header>
    <main>
      <h1>Bienvenido</h1>
      <p>Login/logout listos. El dashboard viene en el paso 4.</p>
    </main>
  `,
  styles: [`
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      background: var(--blue-950);
      color: white;
    }
    button {
      border: 0;
      border-radius: 8px;
      padding: 0.55rem 0.9rem;
      background: var(--blue-500);
      color: white;
      cursor: pointer;
    }
    main { padding: 2rem; }
  `],
})
export class HomeComponent {
  constructor(readonly auth: AuthService) {}
}
