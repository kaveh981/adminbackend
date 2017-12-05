

import { injectable, inject } from 'inversify';
import { Menus as Menu } from '../../../model-layer';
import { GenericRepository } from '../../../data-layer';
import { IMenus } from './menus.infc';


@injectable()
class Menus implements IMenus {

    constructor( @inject('GenericRepository') private repo: GenericRepository<any>) { }

    public async  addMenu(menu: Menu): Promise<Menu> {
        let result: Menu = await this.repo.save(menu);
        return result;
    }

    public async  getMainMenus(): Promise<Menu[]> {

        let result: Menu[] = await this.repo.list(Menu, {
            where: {
                parentMenuId: null
            }
        });
        return result;
    }

    public async  getSubMenusByParentId(id: number): Promise<Menu[]> {
        let result: Menu[] = await this.repo.list(Menu, {
            relations: ['parent'],
            where: {
                parentMenuId: id
            }
        });
        return result;
    }

    public async  findById(id: number): Promise<Menu> {
        let result: Menu = await this.repo.getSingle(Menu, {
            where: {
                "menuId": id
            }
        });
        return result;
    }

    public async  update(menu: Menu): Promise<Menu> {
        
        let result: Menu = await this.repo.getSingle(Menu, {
            where: {
                "menuId": menu.menuId
            }
        });
        result.title = menu.title;

        await this.repo.save(result);
        return result;
    }

    public async  removeById(id: number): Promise<Menu> {
        let result: Menu = await this.repo.getSingle(Menu, {
            where: {
                "menuId": id
            }
        });
        await this.repo.remove([result]);
        return result;
    }


}
export { Menus };


