import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

export type EtupStat = {
  variable: string;
  anio: string | number;
  idMes: string | number;
  transporte: string;
  total: string | number;
}

@Injectable({ providedIn: 'root'})
export class EtupService {
  constructor(private readonly http: HttpClient) {}

  obtenerTransportes() {
    return this.http.get<string[]>(`${environment.apiUrl}/etup/transportes`);
  }

  obtenerEstadisticas(filtros: {
    anioInicio: number;
    mesInicio: number;
    anioFin: number;
    mesFin: number;
    transporte?: string;
  }) {
    let params = new HttpParams()
      .set('anioInicio', filtros.anioInicio)
      .set('mesInicio', filtros.mesInicio)
      .set('anioFin', filtros.anioFin)
      .set('mesFin', filtros.mesFin);

      if(filtros.transporte) {
        params = params.set('transporte', filtros.transporte);
      }

      return this.http.get<EtupStat[]>(
        `${environment.apiUrl}/etup/estadisticas`,
        { params },
      );
  }
}
