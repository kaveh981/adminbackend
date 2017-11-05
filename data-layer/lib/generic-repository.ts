
import { injectable, inject } from 'inversify';
import { createConnection, Connection, getConnectionManager, ConnectionOptions, getManager } from "typeorm";
import { IGenericRepository, ObjectType } from './interfaces/generic-repository.infc';

@injectable()
class GenericRepository<T> implements IGenericRepository<T> {

    private connection: Connection;
    constructor( @inject('MysqlConfig') private config: ConnectionOptions) { }
    public async init() {

        if (this.connection) {
            return this.connection;
        }
        if (getConnectionManager().has('default')) {
            console.log('already connected');
            return this.connection = getConnectionManager().get();
        }
        console.log('connection is not on');
        this.connection = await createConnection(this.config);
        console.log('created new repo');
        return Promise.resolve(this.connection);
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