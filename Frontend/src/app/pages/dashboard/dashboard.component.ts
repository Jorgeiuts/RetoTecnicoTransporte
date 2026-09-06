import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { EtupService, EtupStat } from "../../core/etup.service";
import { AuthService } from "../../core/auth.service";

const VARIABLES = [
  'Ingresos por pasaje',
  'Kilómetros recorridos',
  'Longitud de servicio',
  'Pasajeros transportados',
  'Unidades en operación',
] as const;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  transportes: string[] = [];
  stats: EtupStat[] = [];
  anioInicio = 2020;
  mesInicio = 1;
  anioFin = 2020;
  mesFin = 12;
  transporte = '';

  loading = false;
  error = '';

  readonly variables = VARIABLES;
  constructor(
    readonly auth: AuthService,
    private readonly etup: EtupService,
  ) {}

  ngOnInit() {
    this.etup.obtenerTransportes().subscribe({
      next: (t) => (this.transportes = t),
      error: () => (this.error = 'No se pudieron cargar transportes'),
    });
    this.buscar();
  }

  buscar() {
    this.loading = true;
    this.error = '';
    this.etup
      .obtenerEstadisticas({
        anioInicio: this.anioInicio,
        mesInicio: this.mesInicio,
        anioFin: this.anioFin,
        mesFin: this.mesFin,
        transporte: this.transporte || undefined,
      })
      .subscribe({
        next: (data) => {
          this.stats = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = 'Error al cargar estadísticas';
        },
      });
  }

  totalPorVariable(variable: string): number {
    return this.stats
      .filter((s) => s.variable === variable)
      .reduce((acc, s) => acc + Number(s.total), 0);
  }

  seriePorVariable(variable: string) {
    const map = new Map<string, number>();
    for (const s of this.stats.filter((x) => x.variable === variable)) {
      const key = `${s.anio}-${String(s.idMes).padStart(2, '0')}`;
      map.set(key, (map.get(key) || 0) + Number(s.total));
    }
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([periodo, total]) => ({ periodo, total }));
  }
}
