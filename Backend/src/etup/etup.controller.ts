import { Controller, Get, Post } from "@nestjs/common";
import { EtupService } from "./etup.service";

//Controlador para la entidad Etup
@Controller('etup')
export class EtupControler {
    //Inyectamos el servicio de la entidad Etup
    constructor(private readonly etupService: EtupService) {}

    //Metodo para sincronizar los datos de la api con la base de datos
    @Post('sync')
    sync() {
        return this.etupService.obtenerDataApi();
    }

    //Metodo para obtener todos los registros de la entidad Etup
    @Get()
    findAll() {
        return this.etupService.findAll();
    }
}