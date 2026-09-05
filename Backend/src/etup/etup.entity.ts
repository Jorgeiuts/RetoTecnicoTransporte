import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

//Generamos la entidad para la tabla de etup (Estadistica de transporte urbano de pasajeros)
@Entity()
export class Etup {
    //Crea una llave primaria autoincremental 
    @PrimaryGeneratedColumn()
    id: number;

    //Crea una columna unica para el id de la api( este id no puede repetirse )
    @Column({ unique: true })
    apiId: string;

    @Column()
    anio: number;

    @Column()
    idMes: number;

    @Column()
    transporte: string;

    @Column()
    variable: string;

    @Column()
    idEntidadUnico: string;

    @Column()
    idEntidad: number;

    @Column()
    entidad: string;

    @Column()
    idMunicipioUnico: string;

    @Column()
    idMunicipio: number;

    @Column()
    municipio: string;

    //Crea una columna para el valor ( este valor es un numero grande ) suele manejarse como string para evitar errores de precision
    @Column({ type: 'bigint' })
    valor: string;

    @Column()
    estatus: string;
}