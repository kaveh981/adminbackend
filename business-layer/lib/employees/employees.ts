import "reflect-metadata";

import { injectable, inject } from 'inversify';
import { Employees as Employee, Users as User, Roles as Role } from '../../../model-layer';
import { GenericRepository } from '../../../data-layer';
import { IEmployees } from './employees.infc';


@injectable()
class Employees implements IEmployees {

    constructor( @inject('GenericRepository') private repo: GenericRepository<any>) { }

    public async  addEmployee(employee: User): Promise<User> {
        let result: User = await this.repo.save(employee);
        return result;
    }

    public async  getEmployees(): Promise<Employee[]> {
        let result: Employee[] = await this.repo.list(Employee, { relations: ['user'] });
        return result;
    }

    public async  findById(id: number): Promise<Employee> {
        let result: Employee = await this.repo.getSingle(Employee, {
            relations: ["user"],
            where: {
                "userUserId": id
            }
        });
        return result;
    }

    public async  update(user: User): Promise<User> {
        let result: User = await this.repo.getSingle(User, {
            relations: ["employee"],
            where: {
                "userId": user.userId
            }
        });
        result.employee.email = user.employee.email;
        result.family = user.family;
        result.name = user.name;
        let savedResult = await this.repo.save(result);
        return savedResult;
    }

    public async  removeById(id: number): Promise<any> {
        let user: User = await this.repo.getSingle(User, {
            where: {
                "userId": id
            }
        });
        let employee: Employee = await this.repo.getSingle(Employee, {
            where: {
                "userUserId": id
            }
        });
        let emp = await this.repo.remove([employee, user]);
        return 'deleted';

    }

    public async  addRoleToEmployee(employeeId: number, roleId: number): Promise<User> {
        let employee: Employee = await this.repo.getSingle(Employee, {
            where: {
                "userUserId": employeeId
            }
        });
        let role: Role = await this.repo.getSingle(Role, {
            where: {
                "roleId": roleId
            }
        });
        employee.employeesRoles.push(role);
        let savedResult = await this.repo.save(employee);

        return savedResult;
    }


}
export { Employees };


