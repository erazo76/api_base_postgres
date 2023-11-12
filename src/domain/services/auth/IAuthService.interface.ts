import { Injectable } from "@nestjs/common";
import { Users } from 'infrastructure/database/mapper/Users.entity';

@Injectable()
export abstract class IAuthService {
    abstract verifyUser(username: string, password: any): Promise<Users>;
    abstract login(user: Users): Promise<any>;
}