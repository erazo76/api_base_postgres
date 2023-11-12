import { Injectable } from '@nestjs/common';
import { Users } from 'infrastructure/database/mapper/Users.entity';
import { Credentials } from 'infrastructure/interfaces/credentials.interface';

@Injectable()
export abstract class IAuthUseCase {
  abstract login(user: Users): Promise<Credentials>;
  abstract validateUserCredentials(
    userName: string,
    password: string,
  ): Promise<Users | null>;
}
