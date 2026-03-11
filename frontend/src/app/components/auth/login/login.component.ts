import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user/user.service'; // 👈 Necesario para validar en DB
import { AuthService } from '../../../services/auth/auth.service'; // 👈 Necesario para guardar sesión
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorLogin: string = '';
  loginExitoso: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private http: HttpClient, // 👈 AÑADE ESTA LÍNEA AQUÍ
  ) {}

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    // 🔒 PASO A: Validar si ya está logueado ANTES de mostrar el formulario
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard'], { replaceUrl: true });
      return; // Salimos de la función para no ejecutar lo de abajo
    }

    // 📝 PASO B: Tu código actual del formulario
    this.loginForm = this.fb.group({
      document: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false],
    });
  }

  onLogin(): void {
    this.errorLogin = '';
    this.loginExitoso = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // 1. Extraemos los datos del formulario
    const { document, password } = this.loginForm.value;

    // 2. Armamos el DTO para el Backend (coincidiendo con LoginRequest.java)
    const loginRequest = {
      identifier: String(this.loginForm.value.document).trim(),
      password: this.loginForm.value.password,
    };

    // 3. Llamamos al endpoint de Login real
    // Usamos { responseType: 'text' } porque el Java devuelve un String plano
    this.http
      .post('http://localhost:8081/api/users/login', loginRequest, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          // Si el Backend responde "Login correcto", procedemos
          if (response === 'Login correcto') {
            // 4. Como el login solo devuelve un texto, necesitamos los datos del usuario
            // para el Dashboard. Los buscamos una sola vez por su documento.
            this.userService.getUsers().subscribe((users) => {
              const user = users.find((u) => String(u.document) === String(document));

              if (user) {
                this.loginExitoso = `¡Hola ${user.name}! Entrando... a ScrAppi`;

                // Guardamos la sesión en el servicio y en localStorage
                this.authService.setSession(user);
                localStorage.setItem('usuarioSesion', JSON.stringify(user));

                this.cdr.detectChanges();

                setTimeout(() => {
                  this.router.navigate(['/dashboard'], { replaceUrl: true });
                }, 2000);
              }
            });
          }
        },
        error: (err) => {
          // Si el servidor devuelve 401 o 404, entra aquí
          this.errorLogin = 'Documento o contraseña incorrectos.';
          this.cdr.detectChanges();
          setTimeout(() => {
            this.errorLogin = '';
            this.cdr.detectChanges();
          }, 5000);
        },
      });
  }
}
