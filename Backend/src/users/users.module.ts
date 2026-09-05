import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

//Modulo para la gestion de usuarios
@Module({
    //Preparar un repositorio para la entidad User
    imports: [TypeOrmModule.forFeature([User])],
    //Inyectamos el servicio de la entidad User
    providers: [UsersService],
    //Exportamos el servicio y el repositorio de la entidad User
    exports: [UsersService, TypeOrmModule],
})

export class UsersModule {}