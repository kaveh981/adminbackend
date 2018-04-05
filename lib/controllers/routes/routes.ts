import { controller, httpGet, httpPost, httpPut, httpDelete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request } from 'express';
import { Employees as Employee, Roles as Role, Routes as Route } from '../../../model-layer';
import { IRoutes } from '../../../business-layer';
import { Payload } from '../../exporter';

@injectable()
@controller('/routes')
export class RouteController {
  constructor( @inject('Routes') private routes: IRoutes) { }

  @httpPost('/')
  public async addRoute(request: Request): Promise<any> {
    let res = await this.routes.addRoute({
      registererId: request['user'].id, route: request.body['route'],
      method: request.body['method'], roleId: request.body['roleId']
    });
    return res;
  }

  @httpGet('/')
  public async getRoutes(request: Request): Promise<Route[]> {
    let res = await this.routes.getRoutes();
    return res
  }

  @httpGet('/:id')
  public async getRouteById(request: Request): Promise<Route> {
    let res = await this.routes.findById(Number(request.params['id']));
    return res
  }

  @httpPut('/')
  public async updateRoute(request: Request): Promise<Route> {
    let res = await this.routes.update(request.body);
    return res;
  }

  @httpDelete('/:id')
  public async deleteRole(request: Request): Promise<ReturnStatus> {
    let res = await this.routes.removeById(request.params['id']);
    return res;
  }

}
