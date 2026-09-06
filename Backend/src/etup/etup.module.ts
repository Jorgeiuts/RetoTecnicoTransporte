import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Etup } from "./etup.entity";
import { EtupService } from "./etup.service";
import { EtupController } from "./etup.controller";
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    //Preparar un repositorio para la entidad Etup
    imports: [
        TypeOrmModule.forFeature([Etup]),
        //Configuramos el passport para usar el JWT
        PassportModule.register({ defaultStrategy: 'jwt'}),
    ],
    controllers: [EtupController],
    providers: [EtupService],
    exports: [TypeOrmModule]
})
export class EtupModule {}