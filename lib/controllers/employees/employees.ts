import { controller, httpGet, httpPost, httpPut, httpDelete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request } from 'express';
import { Employees as Employee, Users as User } from '../../../model-layer';
import { IEmployees, ChangePassword } from '../../../business-layer';
import { Payload } from '../../exporter';
import { ReturnStatus } from '../../../types.infc';

@injectable()
@controller('/employees')
export class EmployeeController {
  private _employees: IEmployees;
  constructor( @inject('Employees') employees: IEmployees) {
    this._employees = employees;
  }

  @httpPost('/')
  public async addEmployee(request: Request): Promise<any> {
    console.log(request.body);
    let user = new User();
    user.family = request.body['family'];
    user.name = request.body['name'];
    let employee = new Employee();
    employee.email = request.body['email'];
    employee.password = request.body['password'];
    user.employee = employee;
    let res = await this._employees.addEmployee(user);
    let er = Payload.addEmployee(res);
    return er;
  }

  @httpGet('/')
  public async get(): Promise<any> {
    let res = await this._employees.getEmployees();
    return res.map((e) => Payload.getEmployee(e));
  }

  @httpGet('/:id')
  public async getEmployeeById(request: Request): Promise<any> {
    let res = await this._employees.findById(Number(request.params['id']));
    return Payload.getEmployee(res);
  }

  @httpPut('/')
  public async updateEmployee(request: Request): Promise<any> {
    let user = new User();
    user.family = request.body['family'];
    user.userId = request.body['id'];
    user.name = request.body['name'];
    let res = await this._employees.update(user);
    return Payload.addEmployee(res);
  }

  @httpPut('/password')
  public async changePassword(request: Request): Promise<ReturnStatus> {
    let changePassword: ChangePassword = {
      id: request.body['id'],
      oldPassword: request.body['oldPassword'],
      newPassword: request.body['newPassword']
    };
    return await this._employees.updatePassword(changePassword);
  }

  @httpPut('/email')
  public async updateEmail(request: Request): Promise<ReturnStatus> {
    let employee = new Employee();
    employee.email = request.body['email'];
    employee.employeeId = request.body['id'];
    employee.password = request.body['password'];
    return await this._employees.updateEmail(employee);
  }

  @httpDelete('/:id')
  public async deleteEmployee(request: Request): Promise<any> {
    let res = await this._employees.removeById(Number(request.params['id']));
    return res;
  }

}
