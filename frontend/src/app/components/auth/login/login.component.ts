import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; // 👈 Importante para navegar al registro
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // 👈 Añadimos RouterLink
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {}

  // Getter para facilitar errores en el HTML
  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      // Validamos que sean números, como en el registro
      documento: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      // 👈 ESTA LÍNEA elimina el error de la consola
      remember: [false],
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      console.log('Login data:', this.loginForm.value);
      // Aquí es donde en el futuro validaremos contra PostgreSQL

      // Navegación programática al Dashboard
      this.router.navigate(['/dashboard']);
    } else {
      this.loginForm.markAllAsTouched();
      console.warn('Formulario de login inválido');
    }
  }
}
