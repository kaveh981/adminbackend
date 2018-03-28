import { controller, httpGet, httpPost, httpPut, httpDelete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request } from 'express';
import { Employees as Employee, Users as User } from '../../../model-layer';
import { IEmployees } from '../../../business-layer';
import { Payload } from '../../exporter';

@injectable()
@controller('/employees')
export class EmployeeController {
  private _employees: IEmployees;
  constructor( @inject('Employees') employees: IEmployees) {
    this._employees = employees;
  }



  @httpPost('/')
  public async addEmployee(request: Request): Promise<any> {
    console.log(request['user']);
    let res = await this._employees.addEmployee({
      family: request.body['family'],
      name: request.body['name'],
      email: request.body['email'],
      password: request.body['password'],
      registererId: request['user'].id
    });
    let er = Payload.addEmployee(res);
    return er;
  }

  @httpGet('/')
  public async get(request: Request): Promise<any> {

    let pagination: Pagination = {
      skip: request.query['skip'],
      take: request.query['take'],
      sort: request.query['sortBy'],
      order: request.query['orderBy']
    };
    console.log(request['user'])
    let res = await this._employees.getEmployees({ pagination: pagination, employeeId: request['user'].id });
    return res.map((e) => Payload.getEmployee(e));
  }

  @httpGet('/:id')
  public async getEmployeeById(request: Request): Promise<any> {
    let res = await this._employees.findById(
      {
        employeeId: Number(request.params['id']),
        loggedInUserId: request['user'].id
      });
    return Payload.getEmployee(res);
  }

  @httpPut('/')
  public async updateEmployee(request: Request): Promise<ReturnStatus> {
    return await this._employees.update({
      family: request.body['family'],
      name: request.body['name'],
      employeeId: request.body['id'],
      loggedInUserId: request['user'].id
    });
  }

  @httpPut('/password')
  public async changePassword(request: Request): Promise<any> {
    return await this._employees.updatePassword({
      employeeId: request.body['id'],
      oldPassword: request.body['oldPassword'],
      newPassword: request.body['newPassword'],
      loggedInUserId: request['user'].id
    });
  }

  @httpPut('/email')
  public async updateEmail(request: Request): Promise<any> {
    return await this._employees.updateEmail({
      email: request.body['email'],
      employeeId: request.body['id'],
      password: request.body['password'],
      loggedInUserId: request['user'].id
    });
  }

  @httpDelete('/:id')
  public async deleteEmployee(request: Request): Promise<any> {
    return await this._employees.removeById({
      employeeId: request.params['id'],
      loggedInUserId: request['user'].id
    });
  }

  @httpPost('/role')
  public async assignRole(request: Request): Promise<ReturnStatus> {
    return await this._employees.addRoleToEmployee({
      registererId: request['user'].id,
      employeeId: request.body['employeeId'],
      roleId: request.body['roleId'],
      checked: request.body['checked']
    });
  }

}
