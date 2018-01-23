'use strict';

import { GenericRepository } from '../../data-layer';
import { Employees, Users, Roles } from '../../model-layer';


/**
 *  Simple Database Populator class used as to insert new entities into a data store during test case
 *  setup.
 */
import { injectable, inject } from 'inversify';

@injectable()
class DataPopulator {

    constructor( @inject('GenericRepository') private repo: GenericRepository<any>) { }


    public async createEmployee(employee?: Employees): Promise<Users> {
        employee = employee || new Employees();
        employee.email = employee.email || 'someName@gmail.com';
        let user = employee.user || new Users();
        user.family = user.family || 'someFamily';
        user.name = user.name || 'someName';
        user.employee = employee;

        return await this.repo.save(user);

    }

    public async createRole(role?: Roles): Promise<Roles> {
        role = role || new Roles();
        role.role = role.role || 'someRole';
        return await this.repo.save(role);
    }

    public async getUserById(id: number): Promise<Users> {
        let result: Users = await this.repo.getSingle(Users, {
            relations: ["employee"],
            where: {
                "userId": id
            }
        });
        return result
    }

    public async getRoleById(id: number): Promise<Roles> {
        let result: Roles = await this.repo.getSingle(Roles, {
            where: {
                "roleId": id
            }
        });
        return result
    }
}

export { DataPopulator };
