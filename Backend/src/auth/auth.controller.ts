import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('inicio-sesion')
    login(@Body() body: { email: string, password: string }) {
        //Desestructuramos el body para obtener el email y la contraseña
        const { email, password } = body;
        //Llamamos al metodo para iniciar sesion
        return this.authService.inicioSesion(email, password);
    }

    @Post('cerrar-sesion')
    logout() {
        return this.authService.cerrarSesion();
    }
}