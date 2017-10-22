
import { Menus as Menu } from '../../../model-layer';

interface IMenus {
    addMenu(menu: Menu): Promise<Menu>;
    getMainMenus(): Promise<Menu[]>;
    getSubMenusByParentId(id: number): Promise<Menu[]>;
    findById(id: number): Promise<Menu>;
    update(menu: Menu): Promise<Menu>;
    removeById(id: number): Promise<Menu>;
}
export { IMenus };


