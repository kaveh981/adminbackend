
import { injectable, inject } from 'inversify';
import { createConnection, Connection, getConnectionManager, ConnectionOptions, getManager, Repository, TreeRepository } from "typeorm";
import { IGenericRepository, ObjectType } from './interfaces/generic-repository.infc';

@injectable()
class GenericRepository<T> implements IGenericRepository<T> {
    db: Connection;
    private connection: Connection;
    constructor( @inject('MysqlConfig') private config: ConnectionOptions) {
        this.init().then(connection => {
            return this.db = connection
        });
    }
    public async init(): Promise<Connection> {

        if (this.connection) {
            return this.connection;
        }
        if (getConnectionManager().has('default')) {
            console.log('already connected');
            return this.connection = getConnectionManager().get();
        }
        console.log('connection is not on');
        this.connection = await createConnection(this.config);
        this.db = this.connection;
        console.log('created new repo');
        return Promise.resolve(this.connection);
    }

    public async getRepository(type: ObjectType<T>): Promise<Repository<T>> {
        this.db = await this.init();
        return this.db.getRepository(type)
    }

    public async getTreeRepository(type: ObjectType<T>): Promise<TreeRepository<T>> {
        this.db = await this.init();
        return this.db.getTreeRepository(type)
    }

    public async list(type: ObjectType<T>, findOptions?: any): Promise<T[]> {
        let db = await this.init();
        return db.getRepository(type).find(findOptions);
    }

    public async getSingle(type: ObjectType<T>, conditions: any): Promise<T> {
        let db = await this.init();
        return db.getRepository(type).findOne(conditions);
    }

    public async remove(entities: (T[])): Promise<any> {
        let db = await this.init();
        let result: T[];
        return await db.manager.transaction(async transactionalEntityManager => {
            let i = 0;
            for (i = 0; i < entities.length; i++) {
                let r1 = await transactionalEntityManager.remove(entities[i]);
            }
            return result;
        });
    }

    public async save(entity: (T | T[])): Promise<T | T[]> {
        let db = await this.init();
        return db.manager.save(entity);
    }

    public async closeConnection(): Promise<void> {
        this.connection.close();
    }

    public async runQuery(query: string): Promise<any> {
        let db = await this.init();
        return db.manager.query(query);
    }

}



export { GenericRepository }