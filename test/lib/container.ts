import 'reflect-metadata';
import { Container } from 'inversify';
import { GenericRepository, IGenericRepository } from '../../data-layer';
import { QueryBuilder, DataSetup, APIRequestHandler, DataPopulator, TestHandler, SuiteHandler } from './exporter';
import { Employees, Roles, Menus, Users } from '../../model-layer';

let container = new Container();
container.bind<DataSetup>('DataSetup').to(DataSetup);
container.bind<QueryBuilder>('QueryBuilder').to(QueryBuilder);
container.bind<DataPopulator>('DataPopulator').to(DataPopulator);
container.bind<APIRequestHandler>('APIRequestHandler').to(APIRequestHandler);
container.bind<IGenericRepository<any>>('GenericRepository').to(GenericRepository);
container.bind<TestHandler>('TestHandler').to(TestHandler);
container.bind<SuiteHandler>('SuiteHandler').to(SuiteHandler);

// container.bind<any>('KnexConfig').toConstantValue({
//     client: 'pg',
//     connection: {
//         host: "elmer-01.db.elephantsql.com",
//         user: "uxpahflz",
//         password: "jziJM4hw5FYqmnGIMA23IjT7yn0aELHq",
//         database: "uxpahflz"
//     }
// });

container.bind<any>('KnexMysqlConfig').toConstantValue({
    client: 'mysql',
    connection: {
        host: "mysql6.gear.host",
        user: "mgmdb",
        password: "Gp7uQ-?f414F",
        database: "mgmdb",
        port: 3306
    }
});

container.bind<any>('MysqlConfig').toConstantValue(
    {
        type: "mysql",
        host: "mysql6.gear.host",
        port: 3306,
        username: "mgmdb",
        password: "Gp7uQ-?f414F",
        database: "mgmdb",

        entities: [
            Users, Roles, Employees, Menus
        ],
        synchronize: false
    }
);

// container.bind<any>('MysqlConfig').toConstantValue({
//     type: "postgres",
//     host: "elmer-01.db.elephantsql.com",
//     port: 5432,
//     username: "uxpahflz",
//     password: "jziJM4hw5FYqmnGIMA23IjT7yn0aELHq",
//     database: "uxpahflz"
// });

// container.bind<any>('KnexMysqlConfig').toConstantValue({
//     client: 'mysql',
//     connection: {
//         host: "sql9.freesqldatabase.com",
//         user: "sql9161833",
//         password: "I633KEbuhg",
//         database: "sql9161833"
//     }
// });

// container.bind<any>('MysqlConfig').toConstantValue({
//     type: "mysql",
//     host: "sql9.freesqldatabase.com",
//     port: 3306,
//     username: "sql9161833",
//     password: "I633KEbuhg",
//     database: "sql9161833"
// });



container.bind<any>('ApiConfig').toConstantValue({
    baseDomain: 'http://localhost:3000',
});

export { container };

