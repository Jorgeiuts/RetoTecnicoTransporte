import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Etup } from "./etup.entity";
import { EtupService } from "./etup.service";
import { EtupController } from "./etup.controller";

@Module({
    //Preparar un repositorio para la entidad Etup
    imports: [TypeOrmModule.forFeature([Etup])],
    controllers: [EtupController],
    providers: [EtupService],
    exports: [TypeOrmModule]
})
export class EtupModule {}