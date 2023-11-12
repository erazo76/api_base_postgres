import { Test } from "@nestjs/testing"
import { IUsersRepository } from "application/ports/Repository/UsersRepository/IUsersRepository.interface";
import { IUsersUseCase } from "application/ports/UseCases/UsersUseCase/IUsersUseCase.interface";
import { UsersUseCase } from "application/use-cases/UsersUseCase/UsersUseCase";
import { Users } from "infrastructure/database/mapper/Users.entity";

describe('IUsersUseCase', () => {
    let useCase: IUsersUseCase;
    let serviceMock = {
        find: jest.fn(),
        findOne: jest.fn(),
        findAndCount: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    }
    beforeEach(async () => {
        const user = await Test.createTestingModule({
            providers: [
                {
                    provide: IUsersUseCase,
                    useClass: UsersUseCase
                },
                {
                    provide: IUsersRepository,
                    useValue: serviceMock
                }
            ],
        }).compile()
        useCase = user.get<IUsersUseCase>(IUsersUseCase);
    })

    it('test IUsersUseCase', () => {
        expect(useCase).toBeTruthy();
    })

    it('test getUsers', async () => {
        jest.spyOn(serviceMock, "find").mockReturnValue([{}]);
        const result = await useCase.getUsers();
        expect(result).toHaveLength(1)
    })

    it('test getUserById', async () => {
        const value = new Users({ od: 1, name: "prueba" });
        jest.spyOn(serviceMock, "findOne").mockReturnValue(value);
        const result = await useCase.getUserById("id");
        expect(result).toStrictEqual(value);
    })

    it('test getUserByUserNameOrEmail', async () => {
        const value = new Users({ od: 1, name: "prueba" });
        jest.spyOn(serviceMock, "findOne").mockReturnValue(value);
        const result = await useCase.getUserByUserNameOrEmail("email");
        expect(result).toStrictEqual(value);
    })

    it('test getUsersPag', async () => {
        jest.spyOn(serviceMock, "findAndCount").mockReturnValue([[{}], 1]);
        const result = await useCase.getUsersPag(1, 1);
        expect(result).toHaveLength(2);
        expect(result[0]).toStrictEqual([{}]);
        expect(result[1]).toBe(1);
    })

    it('test createUser', async () => {
        const data = new Users()
        jest.spyOn(serviceMock, "save").mockReturnValue(data)
        const result = await useCase.createUser(data);
        expect(result).toStrictEqual(data);
    })

    it('test updateUser', async () => {
        const data = new Users();
        jest.spyOn(serviceMock, "update").mockReturnValue(data)
        const result = await useCase.updateUser(data);
        expect(result).toStrictEqual(data);
    })

    it('test deleteUser', async () => {
        const data = { id: "a" };
        jest.spyOn(serviceMock, "delete").mockReturnValue(data);
        const result = await useCase.deleteUser("id");
        expect(result).toStrictEqual(data);
        expect(serviceMock.delete).toBeCalled();
    })

})