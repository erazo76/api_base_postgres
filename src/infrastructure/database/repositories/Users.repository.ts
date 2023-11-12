import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { IUsersRepository } from "application/ports/Repository/UsersRepository/IUsersRepository.interface";
import { Connection } from "typeorm";
import { Users } from "../mapper/Users.entity";
import { BaseRepository } from "./Base.repository";

@Injectable()
export class UsersRepository extends BaseRepository<Users> implements IUsersRepository {
    constructor(@InjectConnection() connection: Connection) {
        super(connection, Users);
    }
}