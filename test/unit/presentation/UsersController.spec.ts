import { Test } from "@nestjs/testing";
import { IUsersUseCase } from "application/ports/UseCases/UsersUseCase/IUsersUseCase.interface";
import { UsersController } from "presentation/controllers/UsersController";
import { PagVM } from "presentation/view-models/shared/PagVM.dto";
import { CreateUserVM } from "presentation/view-models/users/createUser.dto";
import { UpdateUserVM } from "presentation/view-models/users/updateUser.dto";
import { UserVM } from "presentation/view-models/users/userVM.dto";

describe("UsersController", () => {
    let control: UsersController;
    let serviceMock = {
        getUsersPag: jest.fn(),
        getUserById: jest.fn(),
        createUser: jest.fn(),
        update: jest.fn(),
        updateUser: jest.fn(),
        deleteUser: jest.fn(),
        getUserByUserNameOrEmail: jest.fn(),
    };
    beforeEach(async () => {
        const user = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: IUsersUseCase,
                    useValue: serviceMock
                }
            ]
        }).compile();

        control = user.get<UsersController>(UsersController)
    })


    it('test UserController', () => {
        expect(control).toBeTruthy();
    })

    it('test getUserspag', async () => {
        const query = {
            take: 10,
            pag: 1
        } as any;
        jest.spyOn(serviceMock, "getUsersPag").mockReturnValue([[{}], 1]);
        jest.spyOn(UserVM, "toViewModel").mockReturnValue({} as any);
        jest.spyOn(PagVM, "toViewModel").mockReturnValue({ data: [], count: 0 });
        const result = await control.getUserspag(query);
        expect(PagVM.toViewModel).toBeCalled()
        expect(result.data).toStrictEqual([])
        expect(result.count).toBe(0)
    })

    it('test getUserById exception', async () => {
        let result;
        jest.spyOn(serviceMock, "getUserById").mockImplementation(async () => { throw "Error" })
        try {
            result = await control.getUserById("id");
        } catch (error) {
            console.log("Error test:", error);
        }
        expect(result.message).toBe("Error al buscar el usuario")
    })

    it('test getUserById', async () => {
        let result;
        jest.spyOn(serviceMock, "getUserById").mockImplementation(async () => { throw "Error" })
        try {
            result = await control.getUserById("id");
        } catch (error) {
            console.log("Error test:", error);
            expect(error.message).toBe("Error al buscar el usuario")
        }

        jest.spyOn(serviceMock, "getUserById").mockReset();
        jest.spyOn(serviceMock, "getUserById").mockImplementation(async () => ({}))
        jest.spyOn(UserVM, "toViewModel").mockReturnValue({} as any);
        result = await control.getUserById("id");
        expect(result).toStrictEqual({});
    })

    it('test created', async () => {
        const user: any = { password: "test" }
        jest.spyOn(serviceMock, "getUserByUserNameOrEmail").mockImplementationOnce(async () => { throw new Error("error") });
        jest.spyOn(serviceMock, "getUserByUserNameOrEmail").mockImplementationOnce(async () => undefined);
        let result = await control.created(user);
        expect(result).toStrictEqual({ message: 'Email existente' })

        jest.spyOn(serviceMock, "getUserByUserNameOrEmail").mockImplementationOnce(async () => undefined);
        jest.spyOn(serviceMock, "getUserByUserNameOrEmail").mockImplementationOnce(async () => { throw new Error("error") });
        result = await control.created(user);
        expect(result).toStrictEqual({ message: 'UserName existente' })

        jest.spyOn(serviceMock, "getUserByUserNameOrEmail").mockImplementation(async () => undefined);
        jest.spyOn(serviceMock, "createUser").mockImplementationOnce(async () => { throw new Error("error") });

        result = await control.created(user);
        expect(result).toStrictEqual({ message: "Error al crear el rol" })

        jest.spyOn(serviceMock, "createUser").mockImplementation(async () => ({}));
        jest.spyOn(CreateUserVM, "fromViewModel").mockReturnValue(user);
        result = await control.created(user);
        expect(result).toStrictEqual({})
    })

    it('tets update', async () => {
        jest.spyOn(serviceMock, "getUserById").mockImplementationOnce(async () => { throw new Error("error") });
        let result = await control.update("id", {} as any);
        expect(result).toStrictEqual({ message: "Usuario no encontrado" })

        const data: any = { id: 'a' };
        jest.spyOn(serviceMock, "getUserById").mockImplementation(async () => ({}));
        jest.spyOn(serviceMock, "getUserByUserNameOrEmail").mockImplementationOnce(async () => ({ id: 'di' }));
        jest.spyOn(serviceMock, "getUserByUserNameOrEmail").mockImplementationOnce(async () => undefined);
        result = await control.update("id", data);
        expect(result).toStrictEqual({ message: "Email existente" })

        jest.spyOn(serviceMock, "getUserByUserNameOrEmail").mockImplementationOnce(async () => { throw "error" });
        jest.spyOn(serviceMock, "getUserByUserNameOrEmail").mockImplementationOnce(async () => undefined);
        result = await control.update("id", data);
        expect(result).toStrictEqual({ message: "Email existente" })

        jest.spyOn(serviceMock, "getUserByUserNameOrEmail").mockImplementationOnce(async () => undefined);
        jest.spyOn(serviceMock, "getUserByUserNameOrEmail").mockImplementationOnce(async () => { throw "error" });
        result = await control.update("id", data);
        expect(result).toStrictEqual({ message: "UserName existente" })

        jest.spyOn(serviceMock, "getUserByUserNameOrEmail").mockImplementationOnce(async () => undefined);
        jest.spyOn(serviceMock, "getUserByUserNameOrEmail").mockImplementationOnce(async () => ({ id: 'di' }));
        result = await control.update("id", data);
        expect(result).toStrictEqual({ message: "UserName existente" })


        jest.spyOn(serviceMock, "getUserByUserNameOrEmail").mockImplementation(async () => undefined);
        jest.spyOn(serviceMock, "getUserByUserNameOrEmail").mockImplementation(async () => undefined);
        jest.spyOn(UpdateUserVM, "fromViewModel").mockReturnValue({} as any);
        jest.spyOn(serviceMock, "updateUser").mockImplementationOnce(async () => { throw "error" });
        result = await control.update("id", {} as any);
        expect(result).toStrictEqual({ message: "No se pudo actualizar" })

        jest.spyOn(serviceMock, "updateUser").mockImplementation(async () => ({}));
        result = await control.update("id", {} as any);
        expect(result).toStrictEqual({})
    })

    it('test delete', async () => {
        jest.spyOn(serviceMock, "getUserById").mockImplementation(async () => { throw "error" });
        let result = await control.delete("id");
        expect(result).toStrictEqual({ message: "Usuario no encontrado" })

        jest.spyOn(serviceMock, "getUserById").mockReset();
        jest.spyOn(serviceMock, "getUserById").mockImplementation(async () => ({ id: "a" }));
        jest.spyOn(serviceMock, "deleteUser").mockImplementation(async () => { throw "error" });
        result = await control.delete("id");
        expect(result).toStrictEqual({ message: "El usuario esta siendo usado por otra tabla" })

        jest.spyOn(serviceMock, "deleteUser").mockReset();
        jest.spyOn(serviceMock, "deleteUser").mockImplementation(async () => ({}));
        result = await control.delete("id");
        expect(result).toStrictEqual({ id: "a" });

        jest.spyOn(serviceMock, "getUserById").mockImplementation(async () => (null));
        result = await control.delete("id");
        expect(result).toStrictEqual({ message: "Usuario no encontrado" })
    })
})