import { Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { EtupService } from "./etup.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

//Controlador para la entidad Etup
@UseGuards(JwtAuthGuard)
@Controller('etup')
export class EtupController {
    //Inyectamos el servicio de la entidad Etup
    constructor(private readonly etupService: EtupService) {}

    //Metodo para sincronizar los datos de la api con la base de datos
    @Post('sync')
    sync() {
        return this.etupService.obtenerDataApi();
    }

    //Metodo para obtener las estadisticas de los registros de la entidad Etup
    @Get('estadisticas')
    obtenerEstadisticas(
        //Definimos los parametros de la query
        @Query('anioInicio') anioInicio: string,
        @Query('mesInicio') mesInicio: string,
        @Query('anioFin') anioFin: string,
        @Query('mesFin') mesFin: string,
        @Query('transporte') transporte?: string,
    ) {
        //Retornamos las estadisticas
        return this.etupService.obtenerEstadisticas({
            anioInicio: Number(anioInicio),
            mesInicio: Number(mesInicio),
            anioFin: Number(anioFin),
            mesFin: Number(mesFin),
            transporte: transporte || undefined,
        });
    }

    //Metodo para obtener los transportes de la entidad Etup
    @Get('transportes')
    obtenerTransportes() {
        return this.etupService.obtenerTransportes();
    }

    //Metodo para obtener todos los registros de la entidad Etup
    @Get()
    findAll() {
        return this.etupService.findAll();
    }
}