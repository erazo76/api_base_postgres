import { Injectable } from '@nestjs/common';
import { Users } from 'infrastructure/database/mapper/Users.entity';
import { IRepository } from '../IRepository.interface';

@Injectable()
export abstract class IUsersRepository extends IRepository<Users> {
}
