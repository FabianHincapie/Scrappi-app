import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, NgbCollapseModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  //Variable para controlar el menu en vista móvil
  isMenuCollapsed = true;
  horaActual: Date = new Date();
  ubicacion: string = 'Esperando acción...';

  ngOnInit(): void {
    // Reloj dinámico: Actualiza cada segundo
    setInterval(() => {
      this.horaActual = new Date();
    }, 1000);
  }

  marcarAsistencia() {
    if (navigator.geolocation) {
      this.ubicacion = 'Capturando ubicación GPS...';
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          this.ubicacion = `Marcado en: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          alert(`¡Marcaje exitoso a las ${this.horaActual.toLocaleTimeString()}!`);
        },
        (err) => {
          this.ubicacion = 'Error: Por favor activa el GPS.';
          console.error('Error de ubicación:', err);
        },
      );
    }
  }
}
