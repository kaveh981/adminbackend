
import { Routes as Route } from '../../../model-layer';

interface IRoutes {
    getRoutes(pagination?: Pagination): Promise<Route[]>;
    addRoute(route: AddRoute): Promise<Route>;
    findById(id: number): Promise<Route>;
    update(route: UpdateRoute): Promise<ReturnStatus>;
    removeById(id: number): Promise<ReturnStatus>;
    getRoleForRoute(route, method: Method): Promise<string>;
}
export { IRoutes };


