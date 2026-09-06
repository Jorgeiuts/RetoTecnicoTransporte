import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { EtupService, EtupStat } from "../../core/etup.service";
import { AuthService } from "../../core/auth.service";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler } from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
);

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
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  transportes: string[] = [];
  stats: EtupStat[] = [];
  anioInicio = 2020;
  mesInicio = 1;
  anioFin = 2020;
  mesFin = 12;
  transporte = '';

  loading = false;
  error = '';

  variableGrafica: string = VARIABLES[0];
  private chart?: Chart;

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

  ngAfterViewInit() {
    this.actualizarGrafica();
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
          this.actualizarGrafica();
        },
        error: () => {
          this.loading = false;
          this.error = 'Error al cargar estadísticas';
        },
      });
  }

  actualizarGrafica() {
    if (!this.chartCanvas) return;
    const serie = this.seriePorVariable(this.variableGrafica);
    const labels = serie.map((p) => p.periodo);
    const values = serie.map((p) => p.total);
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: this.variableGrafica,
            data: values,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.15)',
            pointBackgroundColor: '#1e3a5f',
            fill: true,
            tension: 0.25,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          x: { title: { display: true, text: 'Periodo (año-mes)' } },
          y: { beginAtZero: true, title: { display: true, text: 'Total' } },
        },
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
