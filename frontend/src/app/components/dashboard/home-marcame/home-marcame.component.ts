import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; //Modal

@Component({
  selector: 'app-home-marcame',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-marcame.component.html',
  styleUrl: './home-marcame.component.css',
})
export class HomeMarcameComponent implements OnInit {
  horaActual: Date = new Date();
  ubicacionEstado: string = 'Esperando marcaje...';
  jornadaActiva: boolean = false;

  // Variables para la alerta
  mostrarAlertaExito: boolean = false;
  mensajeAlerta: string = '';

  // Variable s Alert Error
  mostrarAlertaError: boolean = false;
  mensajeError: string = '';

  // Actualiza con tus coordenadas reales detectadas
  readonly PUESTO_LAT = 6.144001849797517;
  readonly PUESTO_LON = -75.61502790639385;
  // Mantengamos el radio en 0.001 (aprox 110 metros) para que la geovalla sea precisa
  readonly RADIO_MAXIMO = 0.001;

  constructor(
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
  ) {}

  //Mostrar el Reloj
  ngOnInit(): void {
    setInterval(() => {
      this.horaActual = new Date();
    }, 1000);
  }
  // 1. Método principal que abre el modal de ng-bootstrap
  solicitarRegistro(content: any) {
    this.modalService.open(content, { centered: true }).result.then(
      (result) => {
        if (result === 'confirmar') {
          console.log('✅ Usuario confirmó el registro. Iniciando captura GPS...');
          this.registrarAsistencia();
        }
      },
      () => {
        console.log('🚫 Registro cancelado por el usuario.');
        this.ubicacionEstado = 'Operación cancelada.';
        this.cdRef.detectChanges(); //
      },
    );
  }

  // 2. Lógica interna que procesa el GPS y valida la geovalla
  private registrarAsistencia() {
    if (navigator.geolocation) {
      this.ubicacionEstado = 'Obteniendo GPS...';
      this.cdRef.detectChanges();
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          // 👈 ESTE ES EL LOG DE OBSERVABILITY
          console.log(`📍 Coordenadas detectadas: Lat ${lat}, Lon ${lon}`);
          console.log(`🎯 Puesto asignado: Lat ${this.PUESTO_LAT}, Lon ${this.PUESTO_LON}`);

          const distancia = Math.sqrt(
            Math.pow(lat - this.PUESTO_LAT, 2) + Math.pow(lon - this.PUESTO_LON, 2),
          );
          console.log(`📏 Distancia calculada (grados): ${distancia}`);

          if (distancia <= this.RADIO_MAXIMO) {
            console.log('✨ Dentro de geovalla. Actualizando estado...');
            this.jornadaActiva = !this.jornadaActiva;

            // Configuración la alerta de Bootstrap
            this.mensajeAlerta = `Marcaje de ${this.jornadaActiva ? 'Entrada' : 'Salida'} exitoso.`;
            this.mostrarAlertaExito = true;
            this.cdRef.detectChanges();
            this.ubicacionEstado = this.jornadaActiva
              ? 'Entrada registrada con éxito'
              : 'Salida registrada con éxito';
            // La alerta se cierra sola tras 5 segundos
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.cdRef.detectChanges(); // También después de ocultar la alerta
            }, 5000);
          } else {

            console.warn('⚠️ Fuera de geovalla. Registro rechazado.');
            this.ubicacionEstado = 'Fuera de rango: No puedes marcar aquí.';
            this.mensajeError = 'Error: Te encuentras fuera de la geovalla permitida.';
            this.mostrarAlertaError = true;
            this.cdRef.detectChanges();

            // La alerta de error también se oculta sola tras 5 segundos
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.cdRef.detectChanges();
            }, 5000);
          }
        },
        (error) => {

          console.error('❌ Error de GPS:', error);
          this.ubicacionEstado = 'Error: Activa el permiso de ubicación.';
          this.cdRef.detectChanges();
        },
        { enableHighAccuracy: true }, // Forzamos alta precisión para evitar el "doble clic"
      );
    }
  }
}
