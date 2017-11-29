import "reflect-metadata";

import { injectable, inject } from 'inversify';
import { Roles as Role } from '../../../model-layer';
import { GenericRepository } from '../../../data-layer';
import { IRoles } from './roles.infc';


@injectable()
class Roles implements IRoles {

    constructor( @inject('GenericRepository') private repo: GenericRepository<any>) { }

    public async  addRole(role: Role): Promise<Role> {
        let result: Role = await this.repo.save(role);
        return result;
    }

    public async  getRoles(): Promise<Role[]> {
        let result: Role[] = await this.repo.list(Role);
        return result;
    }

    public async  findById(id: number): Promise<Role> {
        let result: Role = await this.repo.getSingle(Role, {
            alias: "roles",
            where: {
                "roleId": id
            }
        });
        return result;
    }

    public async  update(role: Role): Promise<Role> {
        let result: Role = await this.repo.getSingle(Role, {
            where: {
                "roleId": role.roleId
            }
        });
        result.role = role.role
        await this.repo.save(result);
        return result;
    }

    public async  removeById(id: number): Promise<Role> {
        let result: Role = await this.repo.getSingle(Role, {
            where: {
                "roleId": id
            }
        });
        await this.repo.remove([result]);
        return result;
    }
}
export { Roles };


