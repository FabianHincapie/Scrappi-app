import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent implements OnInit {
  // Datos base para cumplir con la HU 04
  listaEmpleados = [
    {
      id: 1,
      codigo: 'JMENDOTI-TUF',
      nombre: 'Jhon Mendoza',
      puesto: 'Observability Engineer',
      lat: 6.1440018,
      lon: -75.6150279,
      radio: 110,
      estado: 'Activo',
    },
  ];

  totalEmpleados: number = 0;
  alertasGeovalla: number = 0;

  ngOnInit(): void {
    this.totalEmpleados = this.listaEmpleados.length;
    // Simulación inicial de alertas de cumplimiento
    this.alertasGeovalla = 2;
  }

  gestionarGeovalla(empleado: any) {
    console.log(`Configurando Geovalla para ${empleado.codigo}`);
    // Aquí irá la lógica para abrir un modal de edición
  }
}
