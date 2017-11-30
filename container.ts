import 'reflect-metadata';
import { Container } from 'inversify';
import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { Users as User, Roles as Role, Employees as Employee, Menus as Menu ,Category} from './model-layer';
import { IEmployees, Employees, IMenus, Menus, IRoles, Roles } from './business-layer';
import { IGenericRepository, GenericRepository } from './data-layer';
import { EmployeeController, RoleController, MenuController } from './lib/exporter';

let container = new Container();

container.bind<IGenericRepository<any>>('GenericRepository').to(GenericRepository);
// container.bind<any>('MyPgConfig').toConstantValue(
//     {
//         type: "postgres",
//         host: "elmer.db.elephantsql.com",
//         port: 5432,
//         username: "hnuyuiib",
//         password: "DqKAY0UETa852yoIyFNGDa4NAvyvqPqA",
//         database: "hnuyuiib",
//         entities: [
//             User, Role, Employee, Menu
//         ],
//         synchronize: true
//     }
// );

// container.bind<any>('MysqlConfig2').toConstantValue(
//     {
//         type: "mysql",
//         host: "35.196.180.152",
//         port: 3606,
//         username: "root",
//         password: "123456",
//         database: "guestbook",
//         entities: [
//             User, Role, Employee, Menu
//         ],
//         synchronize: true
//     }
// );

container.bind<any>('MysqlConfig').toConstantValue(
    {

        type: "mysql",
        host: "mysql6.gear.host",
        port: 3306,
        username: "mgmdb",
        password: "Gp7uQ-?f414F",
        database: "mgmdb",

        entities: [
            User, Role, Employee, Menu, Category
        ],
        synchronize: false
    }
);
// container.bind<any>('pgConfig').toConstantValue({
//     type: "postgres",
//     host: "pellefant.db.elephantsql.com",
//     port: 5432,
//     username: "yyrqujvq",
//     password: "FoZVWwwwot4GvkTTTeWvSsj0JUcVes1S",
//     database: "yyrqujvq"
// });


container.bind<IEmployees>('Employees').to(Employees);
container.bind<IRoles>('Roles').to(Roles);
container.bind<IMenus>('Menus').to(Menus);


container.bind<interfaces.Controller>(TYPE.Controller).to(EmployeeController).whenTargetNamed('EmployeeController');
container.bind<interfaces.Controller>(TYPE.Controller).to(RoleController).whenTargetNamed('RoleController');
container.bind<interfaces.Controller>(TYPE.Controller).to(MenuController).whenTargetNamed('MenuController');

container.get<IGenericRepository<any>>('GenericRepository').init();

export { container }