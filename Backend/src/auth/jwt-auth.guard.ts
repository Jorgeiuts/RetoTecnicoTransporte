import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

//Guard para la autenticacion con JWT
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}