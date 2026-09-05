import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

//Generamos la entidad para la tabla de usuarios
@Entity('users')
export class User {
    //Crea una llave primaria autoincremental
    @PrimaryGeneratedColumn()
    id: number;

    //Crea una columna unica para el email del usuario
    @Column({ unique: true })
    email: string;

    //Crea una columna para la contraseña del usuario
    @Column()
    password: string;
}