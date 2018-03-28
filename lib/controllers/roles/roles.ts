import { controller, httpGet, httpPost, httpPut, httpDelete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request } from 'express';
import { Employees as Employee, Roles as Role } from '../../../model-layer';
import { IRoles } from '../../../business-layer';
import { Payload } from '../../exporter';

@injectable()
@controller('/roles')
export class RoleController {
  private _roles: IRoles;
  constructor( @inject('Roles') roles: IRoles) {
    this._roles = roles;
  }

  @httpPost('/')
  public async addRole(request: Request): Promise<any> {
    let res = await this._roles.addRole({ registererId: request['user'].id, role: request.body['role'] });
    return res;
  }

  @httpGet('/employee/:id')
  public async get(request: Request): Promise<EmployeeRoles[]> {
    let res = await this._roles.getEmployeeRoles({ registererId: request['user'].id, employeeId: request.params['id'] });
    return res;
  }

  @httpGet('/:id')
  public async getRoleyId(request: Request): Promise<Role> {
    let res = await this._roles.findById(Number(request.params['id']));
    return res
  }

  @httpPut('/')
  public async updateRole(request: Request): Promise<Role> {
    let res = await this._roles.update(request.body);
    return res;
  }

  @httpDelete('/:id')
  public async deleteRole(request: Request): Promise<Role> {
    let res = await this._roles.removeById(Number(request.params['id']));
    return res;
  }

}
