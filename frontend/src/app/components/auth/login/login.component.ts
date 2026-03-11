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
  loginForm: FormGroup;
  errorLogin: string = '';
  loginExitoso: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
  ) {
    // AJUSTE 2: Creamos la estructura del formulario en el constructor
    this.loginForm = this.fb.group({
      document: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard/usuarios'], { replaceUrl: true });
    }
  }

  onLogin(): void {
    this.errorLogin = '';
    this.loginExitoso = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginRequest = {
      identifier: String(this.loginForm.value.document).trim(),
      password: this.loginForm.value.password,
    };

<<<<<<< HEAD
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
=======
    // AJUSTE 3: Eliminamos responseType: 'text' y procesamos el JSON directo
    this.http.post<any>('http://localhost:8080/api/users/login', loginRequest).subscribe({
      next: (user) => {
        if (user && user.role) {
          this.loginExitoso = `¡Excelente: ¡Hola ${user.name}! Entrando a ScrAppi...`;
>>>>>>> 7842aa4 (frontend(auth): actualizar lógica de inicio de sesión y registro de usuarios)

          // IMPORTANTE: Guardamos el objeto como JSON para el componente de administración
          //GUARDAMOS LAS DOS LLAVES PARA NO TENER ERRORES
          localStorage.setItem('usuarioSesion', JSON.stringify(user)); // Para el Guard
          localStorage.setItem('usuariosSesion', JSON.stringify(user)); // Para AdminUsersComponent

          this.authService.setSession(user);
          this.cdr.detectChanges();

          // 🚀 NAVEGACIÓN A LA RUTA HIJA EXACTA
          setTimeout(() => {
            this.router.navigate(['/dashboard/']);
          }, 1500);
        }
      },
      error: (err) => {
        console.error('Error Login:', err);
        this.errorLogin = 'Documento o contraseña incorrectos.';
        this.cdr.detectChanges();
      },
    });
  }
}
