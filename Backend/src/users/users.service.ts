import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';

//Servicio para la gestion de usuarios
@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        //Inyectamos el repositorio de usuarios
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        //Inyectamos el servicio de configuracion
        private readonly configService: ConfigService,
    ) {}

    //Metodo para inicializar el servicio
    async onModuleInit() {
        await this.usuarioAdminExiste();
    }

    //Metodo para verificar si el usuario admin existe
    private async usuarioAdminExiste() {
        const email = this.configService.get<string>('ADMIN_EMAIL');
        const password = this.configService.get<string>('ADMIN_PASSWORD');

        if(!email || !password){
            throw new Error('Faltan ADMIN_EMAIL o ADMIN_PASSWORD en .env');
        }

        //Verificamos si el usuario admin existe
        const existe = await this.userRepository.findOne({ where: { email } });
        if(existe) return;

        //Hasheamos la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        //Creamos el nuevo usuario
        const nuevoUsuario = this.userRepository.create({ email, password: hashedPassword });
        await this.userRepository.save(nuevoUsuario);
        console.log('Usuario admin creado:', email);
    }

    //Metodo para buscar un usuario por email
    buscarPorEmail(email: string) {
        //Buscamos el usuario por email
        return this.userRepository.findOne({ where: { email } });
    }
}