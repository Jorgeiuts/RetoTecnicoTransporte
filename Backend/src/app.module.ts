import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EtupModule } from './etup/etup.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [

    //Configuracion del enviroment para la base de datos
    ConfigModule.forRoot({isGlobal: true}),

    //Configuracion del typeorm para la base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      //Creamos la instancia del configservice para las variables de entorno
      useFactory: (config: ConfigService)=>({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      })
    }),

    //Importamos el modulo de la entidad Etup
    EtupModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
