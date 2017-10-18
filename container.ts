import 'reflect-metadata';
import { Container } from 'inversify';
import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { FooController } from './lib/controller';

let container = new Container();
container.bind<interfaces.Controller>(TYPE.Controller).to(FooController).whenTargetNamed('FooController');

export { container }