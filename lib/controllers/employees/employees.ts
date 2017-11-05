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
    let user = new User();
    user.family = request.body['family'];
    user.name = request.body['name'];
    let employee = new Employee();
    employee.email = request.body['email'];
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
    let res = await this._employees.update(request.body);
    return Payload.addEmployee(res);
  }

  @httpDelete('/:id')
  public async deleteEmployee(request: Request): Promise<any> {
    let res = await this._employees.removeById(Number(request.params['id']));
    return res;
  }

}
