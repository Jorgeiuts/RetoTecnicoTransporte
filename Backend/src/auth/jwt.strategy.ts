import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

//Strategy para la autenticacion con JWT
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    //Constructor para la estrategia
    constructor(config: ConfigService) {
        //Super para llamar al constructor de la clase padre
        super({
            //Extraemos el token del header de la peticion
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            //Obtenemos la clave secreta del JWT
            secretOrKey: config.get<string>('JWT_SECRET') || '',
        });
    }

    //Metodo para validar el payload del token
    validate(payload: { sub: number, email: string }) {
        //Retornamos el userId y el email del usuario
        return { userId: payload.sub, email: payload.email };
    }
}