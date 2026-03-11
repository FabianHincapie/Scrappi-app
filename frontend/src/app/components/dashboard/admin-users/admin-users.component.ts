import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Importación del servicio actualizado a la carpeta 'user'
import { UserService, User } from '../../../services/user/user.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent implements OnInit {
  // Ajuste: Definición de la variable del formulario como userForm
  userForm: FormGroup;
  listaOriginal: User[] = [];
  listaFiltrada: User[] = [];
  isLoading: boolean = true;
  isEditing: boolean = false;
  userIdToEdit: number | null = null;
  // Historial estático (se mantiene nombre como propiedad visual del log)
  historialOriginal = [
    {
      fecha: '08/03/2026 07:13:22',
      nombre: 'Natalia Taborda',
      evento: 'ENTRADA',
      coords: '6.1440, -75.6150',
      validacion: true,
    },
    {
      fecha: '08/03/2026 08:05:45',
      nombre: 'Jhon Mendoza',
      evento: 'RECHAZADO',
      coords: '6.1520, -75.6200',
      validacion: false,
    },
  ];
  historialFiltrado = [...this.historialOriginal];

  totalUsuarios: number = 0; // Ajustado de totalUsuarios
  alertasGeovalla: number = 0;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private userService: UserService,
    private cdr: ChangeDetectorRef, // 👈 Inyectar el detector de cambios
  ) {
    // Definición de validaciones según los campos exactos de User.java
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      document: [null, Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['EMPLOYED', Validators.required],
      // 👈 LOS QUE FALTAN:
      phone: [null, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      status: [true],
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.alertasGeovalla = 2;
  }

  cargarUsuarios(): void {
    this.isLoading = true; // Iniciamos el spinner
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.listaOriginal = data;
        this.listaFiltrada = [...this.listaOriginal];
        this.totalUsuarios = this.listaOriginal.length;
        this.isLoading = false; // 👈 ESTO DEBE EJECUTARSE AQUÍ PARA APAGAR EL SPINNER
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false; // También lo apagamos si hay error para no bloquear la pantalla
        this.cdr.detectChanges();
      },
    });
  }

  // Ajustado: Filtra la lista de usuarios
  filtrarUsuarios(event: any) {
    const valor = event.target.value.toLowerCase();
    this.listaFiltrada = this.listaOriginal.filter(
      (user) =>
        user.name.toLowerCase().includes(valor) || user.userName.toLowerCase().includes(valor),
    );

    this.historialFiltrado = this.historialOriginal.filter((hist) =>
      hist.nombre.toLowerCase().includes(valor),
    );
  }

  abrirModalNuevo(content: any) {
    this.isEditing = false; // 👈 Volvemos a modo "Creación"
    this.userIdToEdit = null; // 👈 Quitamos el ID del usuario anterior

    // Reseteamos el formulario a sus valores por defecto
    this.userForm.reset({
      role: 'EMPLOYED', // Valor inicial
      status: true, // Usuario activo por defecto
    });

    // Habilitamos los campos que bloqueamos en la edición (Documento y Usuario)
    this.userForm.get('document')?.enable();
    this.userForm.get('userName')?.enable();

    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  // Metodo para guardar
  guardarUsuario() {
    if (this.userForm.valid) {
      // 1. Preparamos el payload con los nombres del modelo Java
      const userData = {
        ...this.userForm.value,
        // Mapeo manual si tu Backend espera snake_case,
        // aunque si usas la entidad User.java directa, prefiere los nombres del modelo.
        updateAt: new Date().toISOString(),
      };

      if (this.isEditing && this.userIdToEdit) {
        // 🔵 MODO EDICIÓN (PUT)
        this.userService.updateUser(this.userIdToEdit, userData).subscribe({
          next: () => {
            this.gestionarExitoOperacion('Usuario actualizado correctamente');
          },
          error: (err) => this.gestionarErrorOperacion(err),
        });
      } else {
        // MODO CREACIÓN (POST)
        const payloadNuevo = { ...userData, createdAt: new Date().toISOString() };
        this.userService.createUser(payloadNuevo).subscribe({
          next: () => {
            this.gestionarExitoOperacion('Usuario creado correctamente');
          },
          error: (err) => this.gestionarErrorOperacion(err),
        });
      }
    }
  }

  // Funciones auxiliares para no repetir código:
  private gestionarExitoOperacion(mensaje: string) {
    this.cargarUsuarios();
    this.modalService.dismissAll();
    this.isEditing = false;
    this.userIdToEdit = null;
    this.userForm.reset({ role: 'EMPLOYED', status: true });
    this.cdr.detectChanges();
  }

  private gestionarErrorOperacion(err: any) {
    console.error('Error en la operación:', err);
    alert('Error al procesar la solicitud. Verifica los datos.');
  }

  // Método para actualizar el Usuario
  abrirModalEditar(user: any, content: any) {
    this.isEditing = true;
    this.userIdToEdit = user.id;

    this.userForm.patchValue({
      name: user.name,
      lastName: user.lastName,
      document: user.document,
      userName: user.userName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      status: user.status,
    });

    // Bloqueamos los campos que no deben cambiarse al editar
    this.userForm.get('document')?.disable();
    this.userForm.get('userName')?.disable();

    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  eliminarUsuario(id: number | undefined) {
    if (!id) return;

    // Confirmación profesional para evitar errores
    if (confirm('¿Estás seguro de que deseas desactivar este usuario? (Borrado lógico)')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          // Refrescamos la tabla para ver el cambio (el badge cambiará a rojo)
          this.cargarUsuarios();
          this.cdr.detectChanges();
          console.log('✅ Usuario desactivado correctamente');
        },
        error: (err) => {
          console.error('❌ Error al intentar eliminar:', err);
          alert('No se pudo completar la operación. Revisa la consola.');
        },
      });
    }
  }

  activarUsuario(user: User) {
    if (confirm(`¿Deseas reactivar a ${user.name}?`)) {
      const data = { ...user, status: true };
      this.userService.updateUser(user.id!, data).subscribe({
        next: () => this.cargarUsuarios(),
        error: (err) => console.error(err),
      });
    }
  }

  gestionarGeovalla(user: User) {
    console.log(`Configurando Geovalla para: ${user.userName}`);
  }
}
