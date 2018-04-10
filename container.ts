
import { Container } from 'inversify';
import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import {
    Users as User, Roles as Role, Employees as Employee, Category, Clients as Client,
    AppUsers as AppUser, Stories as Story, StoryCategories, StoryPropNames,
    StoryProperties as StoryProperty, Routes as Route, ProductCategories as ProductCategory
} from './model-layer';
import {
    IEmployees, Employees, IRoles, Roles, BusinessLayerHelper, IClients, Clients,
    IAppUsers, AppUsers, IUsers, Users, IStoryProperties, StoryProperties, IStories, Stories,
    IRoutes, Routes, ProductCategories, IProductCategories
} from './business-layer';
import { IGenericRepository, GenericRepository, QueryBuilder } from './data-layer';
import {
    EmployeeController, RoleController, controllerFactory, Middlewares, StoryController,
    RouteController, ProductController
} from './lib/exporter';
import * as express from 'express';

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
            User, Role, Employee, Category, Client, StoryCategories, Story,
            AppUser, StoryPropNames, StoryProperty, Route, ProductCategory
        ],
        synchronize: true
    }
);

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
// container.bind<any>('MysqlConfig').toConstantValue(
//     {
//         type: "mysql",
//         url: '/cloudsql/' + 'sound-abbey-183822:us-east1:mgm',
//         user: 'root',
//         password: '123456',
//         database: 'guestbook',
//         entities: [
//             User, Role, Employee, Category, Client, StoryCategories, Stories, AppUsers
//         ],
//         synchronize: true
//     }
// );
// container.bind<any>('pgConfig').toConstantValue({
//     type: "postgres",
//     host: "pellefant.db.elephantsql.com",
//     port: 5432,
//     username: "yyrqujvq",
//     password: "FoZVWwwwot4GvkTTTeWvSsj0JUcVes1S",
//     database: "yyrqujvq"
// });
container.bind<QueryBuilder>('QueryBuilder').to(QueryBuilder);

container.bind<IEmployees>('Employees').to(Employees);
container.bind<IAppUsers>('AppUsers').to(AppUsers);
container.bind<IStories>('Stories').to(Stories);
container.bind<IUsers>('Users').to(Users);
container.bind<IStoryProperties>('StoryProperties').to(StoryProperties);
container.bind<IRoles>('Roles').to(Roles);
container.bind<BusinessLayerHelper>('BusinessLayerHelper').to(BusinessLayerHelper);
container.bind<IClients>('Clients').to(Clients);
container.bind<IRoutes>('Routes').to(Routes);
container.bind<IProductCategories>('ProductCategories').to(ProductCategories);

container.bind<string>('Secret').toConstantValue('mgm secret key');

container.bind<Middlewares>('Middlewares').to(Middlewares);
let middlewares = container.get<Middlewares>('Middlewares');
container.bind<express.RequestHandler>('serializeUser').toConstantValue(middlewares.serializeUser);
container.bind<express.RequestHandler>('serializeAppUser').toConstantValue(middlewares.serializeAppUser);
container.bind<express.RequestHandler>('serializeClient').toConstantValue(middlewares.serializeClient);
container.bind<express.RequestHandler>('generateToken').toConstantValue(middlewares.generateToken);
container.bind<express.RequestHandler>('generateRefreshToken').toConstantValue(middlewares.generateRefreshToken);
container.bind<express.RequestHandler>('validateRefreshToken').toConstantValue(middlewares.validateRefreshToken);
container.bind<express.RequestHandler>('rejectToken').toConstantValue(middlewares.rejectToken);
container.bind<express.RequestHandler>('respond').toConstantValue(middlewares.respond.auth);
container.bind<express.RequestHandler>('appRespond').toConstantValue(middlewares.appRespond.user);
container.bind<express.RequestHandler>('respondReject').toConstantValue(middlewares.respond.reject);
container.bind<express.RequestHandler>('respondToken').toConstantValue(middlewares.respond.token);
container.bind<express.RequestHandler>('verifyUser').toConstantValue(middlewares.verifyUser);
container.bind<any>('errorHandler').toConstantValue(middlewares.errorHandler);



let myCcontroller = controllerFactory(container);
container.bind<interfaces.Controller>(TYPE.Controller).to(myCcontroller).whenTargetNamed('Membership');
container.bind<interfaces.Controller>(TYPE.Controller).to(StoryController).whenTargetNamed('StoryController');
container.bind<interfaces.Controller>(TYPE.Controller).to(EmployeeController).whenTargetNamed('EmployeeController');
container.bind<interfaces.Controller>(TYPE.Controller).to(RoleController).whenTargetNamed('RoleController');
container.bind<interfaces.Controller>(TYPE.Controller).to(RouteController).whenTargetNamed('RouteController');
container.bind<interfaces.Controller>(TYPE.Controller).to(ProductController).whenTargetNamed('ProductController');

//container.get<IGenericRepository<any>>('GenericRepository').init();

export { container }