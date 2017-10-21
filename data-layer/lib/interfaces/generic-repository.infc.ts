
export type ObjectType<T> = { new (): T } | Function;


interface IGenericRepository<T> {

    list(type: ObjectType<T>, findOptions?: any): Promise<T[]>;

    getSingle(type: ObjectType<T>, id: any): Promise<T>;

    remove(entity: (T | T[])): Promise<T | T[]>;

    save(entity: (T | T[])): Promise<T | T[]>;

    runQuery(query: string): Promise<any>;

    closeConnection(): Promise<void>;

}

export { IGenericRepository }