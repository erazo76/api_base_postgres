import { IRepository } from "application/ports/Repository/IRepository.interface";
import {
  ObjectLiteral,
  EntityManager,
  QueryRunner,
  DeepPartial,
  SaveOptions,
  RemoveOptions,
  InsertResult,
  ObjectID,
  FindConditions,
  UpdateResult,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  Connection,
  EntityTarget,
  SelectQueryBuilder,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

type updateType =
  | string
  | string[]
  | number
  | number[]
  | Date
  | Date[]
  | ObjectID
  | ObjectID[];

export class BaseRepository<Entity extends ObjectLiteral>
  implements IRepository<Entity> {
  readonly manager: EntityManager;
  readonly queryRunner?: QueryRunner;
  readonly entity: EntityTarget<Entity>;

  constructor(connection: Connection, entity: EntityTarget<Entity>) {
    this.queryRunner = connection.createQueryRunner();
    this.manager = this.queryRunner.manager;
    this.entity = entity;
  }

  hasId(entity: Entity): boolean {
    return this.manager.hasId(entity);
  }

  getId(entity: Entity): any {
    return this.manager.getId(entity);
  }

  create(): Entity;

  create(entityLikeArray: DeepPartial<Entity>[]): Entity[];

  create(entityLike: DeepPartial<Entity>): Entity;

  create(
    plainEntityLikeOrPlainEntityLikes?:
      | DeepPartial<Entity>
      | DeepPartial<Entity>[]
  ): Entity | Entity[] {
    return this.manager.create<any>(
      this.entity as any,
      plainEntityLikeOrPlainEntityLikes as any
    );
  }
  CreateQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner
  ): SelectQueryBuilder<Entity> {
    return this.manager.createQueryBuilder(
      this.entity as any,
      alias,
      queryRunner
    );
  }
  merge(
    mergeIntoEntity: Entity,
    ...entityLikes: DeepPartial<Entity>[]
  ): Entity {
    return this.manager.merge(
      this.entity as any,
      mergeIntoEntity,
      ...entityLikes
    );
  }

  preload(entityLike: DeepPartial<Entity>): Promise<Entity | undefined> {
    return this.manager.preload(this.entity as any, entityLike);
  }

  save<T extends DeepPartial<Entity>>(
    entities: T[],
    options: SaveOptions & { reload: false }
  ): Promise<T[]>;

  save<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions
  ): Promise<(T & Entity)[]>;

  save<T extends DeepPartial<Entity>>(
    entity: T,
    options: SaveOptions & { reload: false }
  ): Promise<T>;

  save<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions
  ): Promise<T & Entity>;

  save<T extends DeepPartial<Entity>>(
    entityOrEntities: T | T[],
    options?: SaveOptions
  ): Promise<T | T[]> {
    return this.manager.save<Entity, T>(
      this.entity as any,
      entityOrEntities as any,
      options
    );
  }

  remove(entities: Entity[], options?: RemoveOptions): Promise<Entity[]>;

  remove(entity: Entity, options?: RemoveOptions): Promise<Entity>;

  remove(
    entityOrEntities: Entity | Entity[],
    options?: RemoveOptions
  ): Promise<Entity | Entity[]> {
    return this.manager.remove(
      this.entity as any,
      entityOrEntities as any,
      options
    );
  }

  softRemove<T extends DeepPartial<Entity>>(
    entities: T[],
    options: SaveOptions & { reload: false }
  ): Promise<T[]>;

  softRemove<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions
  ): Promise<(T & Entity)[]>;

  softRemove<T extends DeepPartial<Entity>>(
    entity: T,
    options: SaveOptions & { reload: false }
  ): Promise<T>;

  softRemove<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions
  ): Promise<T & Entity>;

  softRemove<T extends DeepPartial<Entity>>(
    entityOrEntities: T | T[],
    options?: SaveOptions
  ): Promise<T | T[]> {
    return this.manager.softRemove<Entity, T>(
      this.entity as any,
      entityOrEntities as any,
      options
    );
  }

  recover<T extends DeepPartial<Entity>>(
    entities: T[],
    options: SaveOptions & { reload: false }
  ): Promise<T[]>;

  recover<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions
  ): Promise<(T & Entity)[]>;

  recover<T extends DeepPartial<Entity>>(
    entity: T,
    options: SaveOptions & { reload: false }
  ): Promise<T>;

  recover<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions
  ): Promise<T & Entity>;

  recover<T extends DeepPartial<Entity>>(
    entityOrEntities: T | T[],
    options?: SaveOptions
  ): Promise<T | T[]> {
    return this.manager.recover<Entity, T>(
      this.entity as any,
      entityOrEntities as any,
      options
    );
  }

  insert(
    entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[]
  ): Promise<InsertResult> {
    return this.manager.insert(this.entity as any, entity);
  }

  update(
    criteria: updateType | FindConditions<Entity>,
    partialEntity: QueryDeepPartialEntity<Entity>
  ): Promise<UpdateResult> {
    return this.manager.update(
      this.entity as any,
      criteria as any,
      partialEntity
    );
  }

  delete(criteria: updateType | FindConditions<Entity>): Promise<DeleteResult> {
    return this.manager.delete(this.entity as any, criteria as any);
  }

  softDelete(
    criteria: updateType | FindConditions<Entity>
  ): Promise<UpdateResult> {
    return this.manager.softDelete(this.entity as any, criteria as any);
  }

  restore(
    criteria: updateType | FindConditions<Entity>
  ): Promise<UpdateResult> {
    return this.manager.restore(this.entity as any, criteria as any);
  }

  count(options?: FindManyOptions<Entity>): Promise<number>;

  count(conditions?: FindConditions<Entity>): Promise<number>;

  count(
    optionsOrConditions?: FindManyOptions<Entity> | FindConditions<Entity>
  ): Promise<number> {
    return this.manager.count(this.entity as any, optionsOrConditions as any);
  }

  find(options?: FindManyOptions<Entity>): Promise<Entity[]>;

  find(conditions?: FindConditions<Entity>): Promise<Entity[]>;

  find(
    optionsOrConditions?: FindManyOptions<Entity> | FindConditions<Entity>
  ): Promise<Entity[]> {
    return this.manager.find<Entity>(this.entity, optionsOrConditions as any);
  }

  findAndCount(options?: FindManyOptions<Entity>): Promise<[Entity[], number]>;

  findAndCount(
    conditions?: FindConditions<Entity>
  ): Promise<[Entity[], number]>;

  findAndCount(
    optionsOrConditions?: FindManyOptions<Entity> | FindConditions<Entity>
  ): Promise<[Entity[], number]> {
    return this.manager.findAndCount(
      this.entity as any,
      optionsOrConditions as any
    );
  }

  findByIds(ids: any[], options?: FindManyOptions<Entity>): Promise<Entity[]>;

  findByIds(ids: any[], conditions?: FindConditions<Entity>): Promise<Entity[]>;

  findByIds(
    ids: any[],
    optionsOrConditions?: FindManyOptions<Entity> | FindConditions<Entity>
  ): Promise<Entity[]> {
    return this.manager.findByIds(
      this.entity as any,
      ids,
      optionsOrConditions as any
    );
  }

  findOne(
    id?: string | number | Date | ObjectID,
    options?: FindOneOptions<Entity>
  ): Promise<Entity | undefined>;

  findOne(options?: FindOneOptions<Entity>): Promise<Entity | undefined>;

  findOne(
    conditions?: FindConditions<Entity>,
    options?: FindOneOptions<Entity>
  ): Promise<Entity | undefined>;

  findOne(
    optionsOrConditions?:
      | string
      | number
      | Date
      | ObjectID
      | FindOneOptions<Entity>
      | FindConditions<Entity>,
    maybeOptions?: FindOneOptions<Entity>
  ): Promise<Entity | undefined> {
    return this.manager.findOne(
      this.entity as any,
      optionsOrConditions as any,
      maybeOptions
    );
  }

  findOneOrFail(
    id?: string | number | Date | ObjectID,
    options?: FindOneOptions<Entity>
  ): Promise<Entity>;

  findOneOrFail(options?: FindOneOptions<Entity>): Promise<Entity>;

  findOneOrFail(
    conditions?: FindConditions<Entity>,
    options?: FindOneOptions<Entity>
  ): Promise<Entity>;

  findOneOrFail(
    optionsOrConditions?:
      | string
      | number
      | Date
      | ObjectID
      | FindOneOptions<Entity>
      | FindConditions<Entity>,
    maybeOptions?: FindOneOptions<Entity>
  ): Promise<Entity> {
    return this.manager.findOneOrFail(
      this.entity as any,
      optionsOrConditions as any,
      maybeOptions
    );
  }

  query(query: string, parameters?: any[]): Promise<any> {
    return this.manager.query(query, parameters);
  }

  clear(): Promise<void> {
    return this.manager.clear<Entity>(this.entity);
  }

  increment(
    conditions: FindConditions<Entity>,
    propertyPath: string,
    value: number | string
  ): Promise<UpdateResult> {
    return this.manager.increment(this.entity, conditions, propertyPath, value);
  }

  decrement(
    conditions: FindConditions<Entity>,
    propertyPath: string,
    value: number | string
  ): Promise<UpdateResult> {
    return this.manager.decrement(this.entity, conditions, propertyPath, value);
  }

  async transaction<T>(operation: () => Promise<T>): Promise<T> {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      const result = await operation();

      await this.queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
    } finally {
      await this.queryRunner.release();
    }
  }
}
