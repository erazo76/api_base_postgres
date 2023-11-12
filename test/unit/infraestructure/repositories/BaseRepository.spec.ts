
import { Users } from "infrastructure/database/mapper/Users.entity";
import { BaseRepository } from "infrastructure/database/repositories/Base.repository";
import { Connection, ConnectionOptions, DeleteResult, EntityManager, InsertResult, QueryRunner, UpdateResult } from "typeorm";

describe('BaseRepository', () => {
    let repo: BaseRepository<Users>;
    const fileDemo = new Users();
    let conOptions: ConnectionOptions = {
        type: "postgres"
    }

    let clearResult = false;
    let connected, startedTransaction, commitedTransaction, rollbackedTransaction, released = false;

    const typeormConnection = new Connection(conOptions);
    const manager: EntityManager = new EntityManager(typeormConnection)
    const queryRunner: QueryRunner = {
        ...typeormConnection.createQueryRunner(),
        manager: manager,
        connect: async () => { connected = true; },
        startTransaction: async () => { startedTransaction = true; },
        commitTransaction: async () => { commitedTransaction = true; },
        rollbackTransaction: async () => { rollbackedTransaction = true; },
        release: async () => { released = true; },
    };

    const insertResult = new InsertResult();
    const updateResult = new UpdateResult();
    const deleteResult = new DeleteResult();


    it('Base Repo test wiht Defined result', async () => {

        jest.spyOn(manager, 'hasId').mockImplementation(() => true);
        jest.spyOn(manager, 'getId').mockImplementation(() => true);
        jest.spyOn(manager, 'save').mockImplementation(async () => fileDemo);
        jest.spyOn(manager, 'merge').mockImplementation(async () => fileDemo);
        jest.spyOn(manager, 'preload').mockImplementation(async () => fileDemo);
        jest.spyOn(manager, 'softRemove').mockImplementation(async () => fileDemo);
        jest.spyOn(manager, 'recover').mockImplementation(async () => fileDemo);
        jest.spyOn(manager, 'insert').mockImplementation(async () => insertResult);
        jest.spyOn(manager, 'update').mockImplementation(async () => updateResult);
        jest.spyOn(manager, 'delete').mockImplementation(async () => deleteResult);
        jest.spyOn(manager, 'softDelete').mockImplementation(async () => updateResult);
        jest.spyOn(manager, 'restore').mockImplementation(async () => updateResult);
        jest.spyOn(manager, 'count').mockImplementation(async () => 1);
        jest.spyOn(manager, 'find').mockImplementation(async () => [fileDemo]);
        jest.spyOn(manager, 'findAndCount').mockImplementation(async () => [[fileDemo], 1]);
        jest.spyOn(manager, 'findByIds').mockImplementation(async () => [fileDemo]);
        jest.spyOn(manager, 'findOne').mockImplementation(async () => fileDemo);
        jest.spyOn(manager, 'findOneOrFail').mockImplementation(async () => fileDemo);
        jest.spyOn(manager, 'query').mockImplementation(async () => fileDemo);
        jest.spyOn(manager, 'clear').mockImplementation(async () => { clearResult = true; });
        jest.spyOn(manager, 'increment').mockImplementation(async () => updateResult);
        jest.spyOn(manager, 'decrement').mockImplementation(async () => updateResult);
        jest.spyOn(typeormConnection, 'createQueryRunner').mockImplementation(() => queryRunner);

        repo = new BaseRepository(typeormConnection, Users)
        expect(repo).toBeDefined();


        const hasIdResult = await repo.hasId(fileDemo);
        expect(hasIdResult).toStrictEqual(true);

        const getIdResult = await repo.getId(fileDemo);
        expect(getIdResult).toStrictEqual(true);

        const saveResult = await repo.save(fileDemo);
        expect(saveResult).toStrictEqual(fileDemo);

        const mergeResult = await repo.merge(fileDemo);
        expect(mergeResult).toStrictEqual(fileDemo);

        const preloadResult = await repo.preload(fileDemo);
        expect(preloadResult).toStrictEqual(fileDemo);

        const softRemoveResult = await repo.softRemove(fileDemo);
        expect(softRemoveResult).toStrictEqual(fileDemo);

        const recoverResult = await repo.recover(fileDemo);
        expect(recoverResult).toStrictEqual(fileDemo);

        const insertResult1 = await repo.insert(fileDemo);
        expect(insertResult1).toStrictEqual(insertResult);

        const updateResult1 = await repo.update(fileDemo, null);
        expect(updateResult1).toStrictEqual(updateResult);

        const deleteResult1 = await repo.delete(fileDemo);
        expect(deleteResult1).toStrictEqual(deleteResult);

        const softDeleteResult = await repo.softDelete(fileDemo);
        expect(softDeleteResult).toStrictEqual(updateResult);

        const restoreResult = await repo.restore(fileDemo);
        expect(restoreResult).toStrictEqual(updateResult);

        const countResult = await repo.count();
        expect(countResult).toStrictEqual(1);

        const findResult = await repo.find();
        expect(findResult).toStrictEqual([fileDemo]);

        const findAndCountResult = await repo.findAndCount();
        expect(findAndCountResult).toStrictEqual([[fileDemo], 1]);

        const findByIdsResult = await repo.findByIds([""]);
        expect(findByIdsResult).toStrictEqual([fileDemo]);

        const findOneResult = await repo.findOne();
        expect(findOneResult).toStrictEqual(fileDemo);

        const findOneOrFailResult = await repo.findOneOrFail();
        expect(findOneOrFailResult).toStrictEqual(fileDemo);

        const queryResult = await repo.query("");
        expect(queryResult).toStrictEqual(fileDemo);

        await repo.clear();
        expect(clearResult).toStrictEqual(true);

        const incrementResult = await repo.increment(null, "", 1);
        expect(incrementResult).toStrictEqual(updateResult);

        const decrementResult = await repo.decrement(null, "", 1);
        expect(decrementResult).toStrictEqual(updateResult);

        const transactionCorrectResult = await repo.transaction(async () => ({}));
        expect(transactionCorrectResult).toStrictEqual({});
        expect(connected).toStrictEqual(true);
        expect(startedTransaction).toStrictEqual(true);
        expect(commitedTransaction).toStrictEqual(true);
        expect(released).toStrictEqual(true);


        await repo.transaction(async () => { throw "" });
        expect(rollbackedTransaction).toStrictEqual(true);

    })
});