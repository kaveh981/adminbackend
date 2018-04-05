

import { injectable, inject } from 'inversify';
import { Roles as Role, Employees as Employee, Routes as Route } from '../../../model-layer';
import { GenericRepository } from '../../../data-layer';
import { IRoutes } from './routes.infc';


@injectable()
class Routes implements IRoutes {

    constructor( @inject('GenericRepository') private repo: GenericRepository<any>) { }

    public async  addRoute(route: AddRoute): Promise<Route> {
        let newRoute = new Route();
        newRoute.route = route.route;
        newRoute.method = route.method;
        let role = new Role();
        role.roleId = route.roleId;
        newRoute.role = role;
        let result: Route = await this.repo.save(newRoute);
        await this.writeJson();
        return result;
    }

    async writeJson() {
        let repo = await this.repo.getRepository(Route)
        let result = await repo.createQueryBuilder('routes')
            .leftJoinAndSelect("routes.role", "role")
            .getMany();


        let fs = require('fs');
        fs.readFile('myjsonfile.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let obj = JSON.parse(data); //now it an object
                obj[0] = [];
                obj[1] = [];
                obj[2] = [];
                obj[3] = [];
                result.forEach(route => {

                    obj[route.method].push({ url: route.route, role: route.role.role });
                })
                let json = JSON.stringify(obj);
                fs.writeFile('myjsonfile.json', json, 'utf8', () => {
                    console.log('wrote');
                });
            }
        });


        // fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         obj = JSON.parse(data); //now it an object
        //         obj.table.push({ id: 2, square: 3 }); //add some data
        //         json = JSON.stringify(obj); //convert it back to json
        //         fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back 
        //     }
        // });
    }

    public async  findById(id: number): Promise<Route> {
        let repo = await this.repo.getRepository(Route)
        let result = await repo.createQueryBuilder('routes')
            .leftJoinAndSelect("routes.role", "role")
            .where("routes.routeId = :routeId", { routeId: id })
            .getOne();
        return result;
    }

    public async getRoutes(pagination?: Pagination): Promise<Route[]> {
        let repo = await this.repo.getRepository(Route)
        if (pagination) {
            return await repo.createQueryBuilder('routes')
                .leftJoinAndSelect("routes.role", "role")
                .orderBy(pagination.sort, pagination.order)
                .skip(pagination.skip)
                .take(pagination.take)
                .getMany();
        }
        else {
            return await repo.createQueryBuilder('routes')
                .leftJoinAndSelect("routes.role", "role")
                .getMany();
        }
    }

    async getRoleForRoute(route, method: Method): Promise<string> {
        let repo = await this.repo.getRepository(Route)
        let result = await repo.createQueryBuilder('routes')
            .innerJoinAndSelect("routes.role", "role")
            .select('role.role')
            .where(`routes.route = :route`, { route: route })
            .andWhere(`routes.method = :method`, { method: method })
            .getOne();
        console.log(result);
        return 'employee'
        // return result.role.role;
    }

    public async  update(route: UpdateRoute): Promise<Route> {
        console.log(route);
        let repo = await this.repo.getRepository(Route)
        let result = await repo.createQueryBuilder('routes')
            .leftJoinAndSelect("routes.role", "role")
            .where("routes.routeId = :routeId", { routeId: route.routeId })
            .getOne();
        result.route = route.route;
        result.method = route.method;
        result.role.roleId = route.roleId;
        await this.repo.save(result);
        return result;
    }

    public async  removeById(id: number): Promise<ReturnStatus> {
        try {
            let result: Route = await this.findById(id);
            await this.repo.remove([result]);
            await this.writeJson();
            return { success: true, message: `Deleted` };
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }
}

export { Routes };


