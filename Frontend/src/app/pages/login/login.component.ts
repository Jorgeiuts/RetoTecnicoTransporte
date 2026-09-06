import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../core/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  onSubmit() {
    this.error = '';
    this.loading = true;
    this.auth.iniciarSesion(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        this.loading = false;
        this.error = 'Correo o contraseña incorrectos';
      },
    });
  }
}
