import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Etup } from "./etup.entity";
import { Repository } from "typeorm";

//Definimos el como recibiremos la data de la api
type EtupApiItem = {
    _id: string;
    Anio: number;
    ID_mes: number;
    Transporte: string;
    Variable: string;
    ID_entidad_unico: string;
    ID_entidad: number;
    Entidad: string;
    ID_municipio_unico: string;
    ID_Municipio: number;
    Municipio: string;
    Valor: string;
    Estatus: string;
}

//Aqui contiene toda la logica para obtener la data de la api de ETUP
@Injectable()
export class EtupService {
    //Inyectamos el repositorio de la entidad Etup
    constructor(
        @InjectRepository(Etup)
        //Definimos el repositorio de la entidad Etup
        private readonly etupRepository: Repository<Etup>,
    ) {}

    async obtenerDataApi(): Promise<{ inserted: number}> {
        const response = await fetch('http://apiiieg.jalisco.gob.mx/api/etup');

        if(!response.ok) {
            throw new Error(`Error al consultar la API: ${response.status}`)
        }

        //Definimos el tipo de respuesta de la api
        const json = (await response.json()) as {
            success: boolean;
            data: EtupApiItem[];
        };

        //Creamos los registros para la entidad Etup
        const registros = json.data
            .filter((item) => 
                item.Valor !== undefined &&
                item.Valor !== null
            )
            .map((item) =>
            this.etupRepository.create({
                apiId: item._id,
                anio: item.Anio,
                idMes: item.ID_mes,
                transporte: item.Transporte,
                variable: item.Variable,
                idEntidadUnico: item.ID_entidad_unico,
                idEntidad: item.ID_entidad,
                entidad: item.Entidad,
                idMunicipioUnico: item.ID_municipio_unico,
                idMunicipio: item.ID_Municipio,
                municipio: item.Municipio,
                valor: String(item.Valor),
                estatus: item.Estatus,
            }),
        );

        const registrosPorInsertar: number = 500;
        let registrosInsertados: number = 0;

        //Iteramos sobre los registros en lotes de 500 ya que la api de etup tiene demaciados registros para postgres
        for (let i = 0; i < registros.length; i += registrosPorInsertar) {
            const lotes = registros.slice(i, i + registrosPorInsertar);

            //Construccion de la query para insertar los registros
            const resultado = await this.etupRepository
            //Consulta de la base de datos de forma avanzada
            .createQueryBuilder()
            //Se realizara un insert
            .insert()
            //A que tabla se insertaran dichos datos
            .into(Etup)
            //Se pasan los datos anteriormente creados
            .values(lotes)
            //Si algun registro viola una restriccion ignorarlo y continuar con el resto
            .orIgnore()
            //Ejecutamos el query
            .execute();

            registrosInsertados += resultado.identifiers.length;
        }

        //Retornamos el numero de registros insertados
        return { inserted: registrosInsertados };
    }

    //Metodo para obtener todos los registros de la entidad Etup
    findAll() {
        //Retornamos todos los registros de la entidad Etup
        return this.etupRepository.find();
    }
}