import "reflect-metadata";

import { injectable, inject } from 'inversify';
import { Employees as Employee } from '../../../model-layer';
import { GenericRepository } from '../../../data-layer';
import { IEmployees } from './employees.infc';


@injectable()
class Employees implements IEmployees {

    constructor( @inject('GenericRepository') private repo: GenericRepository<any>) { }

    public async  addEmployee(employee: Employee): Promise<Employee> {
        let result: Employee = await this.repo.save(employee);
        return result;
    }

    public async  getEmployees(): Promise<Employee[]> {
        let result: Employee[] = await this.repo.list(Employee);
        return result;
    }

    public async  findById(id: number): Promise<Employee> {
        console.log("user business" + id);
        let result: Employee = await this.repo.getSingle(Employee, {
            alias: "employees",
            relations: ["users"],
            where: {
                "userUserId": id
            }
        });
        return result;
    }

    public async  update(employee: Employee): Promise<Employee> {
        let result: Employee = await this.repo.getSingle(Employee, {
            alias: "employees",
            relations: ["users"],
            where: {
                "userUserId": employee.user.userId
            }
        });
        result.email = employee.email;
        result.user.family = employee.user.family;
        result.user.name = employee.user.name;
        await this.repo.save(result);
        return result;
    }

    public async  removeById(id: number): Promise<Employee> {
        console.log("user business" + id);
        let result: Employee = await this.repo.getSingle(Employee, {
            alias: "employees",
            relations: ["users"],
            where: {
                "userUserId": id
            }
        });
        await this.repo.remove(result);
        return result;
    }

    public async findByUsername(username: string): Promise<Employee> {
        let result: Employee = await this.repo.getSingle(Employee, {
            alias: "employees",
            relations: ["users"],
            where: {
                "email": username
            }
        });
        return result;
    }

}
export { Employee };


