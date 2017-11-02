
import { injectable, inject } from 'inversify';
import * as Knex from 'knex';

@injectable()
class QueryBuilder {

    private connection: Knex;
    constructor( @inject('KnexMysqlConfig') private config: Knex.Config) { }
    private  init() {

        if (this.connection) {
            return this.connection;
        }

        console.log('knex connection is not on');
        this.connection =  Knex(this.config);
        console.log('knex created new repo');
        return this.connection;
    }


    public  getKnex(): Knex {
        return  this.init();
    }

}

export { QueryBuilder }