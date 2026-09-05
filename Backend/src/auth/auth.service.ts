import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

//Servicio para la autenticacion
@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    //Metodo para iniciar sesion
    async inicioSesion(email: string, password: string) {
        //Buscamos el usuario por email
        const usuario = await this.usersService.buscarPorEmail(email);
        
        //Verificamos si el usuario existe
        if(!usuario) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        //Verificamos si la contraseña es correcta
        const ok = await bcrypt.compare(password, usuario.password);
        if(!ok) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        
        //Creamos el payload para el token
        const payload = { sub: usuario.id, email: usuario.email };
        return {
            access_token: this.jwtService.signAsync(payload),
        };
    }

    //Metodo para cerrar sesion
    cerrarSesion() {
        return { message: 'Sesión cerrada' };
    }
}