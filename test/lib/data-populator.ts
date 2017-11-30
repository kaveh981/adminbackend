'use strict';

import { GenericRepository } from '../../data-layer';
import { Employees, Users, Roles, Menus } from '../../model-layer';


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

    public async createMenu(isMain: boolean, menu?: Menus): Promise<Menus> {
        menu = menu || new Menus();
        menu.title = menu.title || 'someTitle';
        if (!isMain) {
            let parent = menu.parent || new Menus();
            parent.title = 'parentMenu';
            menu.parent = parent;
            let result = await this.repo.save(menu);
            console.log('added menu: ' + JSON.stringify(result));
            return result;
        }
        return await this.repo.save(menu);
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
    public async getMenuById(id: number): Promise<Menus> {
        let result: Menus = await this.repo.getSingle(Menus, {
            relation: ['subMenus'],
            where: {
                menuId: id
            }
        });
        return result
    }
    public async  getMainMenus(): Promise<Menus[]> {
        let result: Menus[] = await this.repo.list(Menus, {
            where: {
                parentMenuId: 'IS NULL'
            }
        });
        return result;
    }
    public async getSubMenusByParentId(id: number): Promise<Menus[]> {
        let result: Menus[] = await this.repo.list(Menus, {
            relation: ['subMenus'],
            where: {
                parentMenuId: id
            }
        });
        return result
    }
}

export { DataPopulator };
