import { controller, httpGet, httpPost, httpPut, httpDelete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request } from 'express';
import { Employees as Employee, Roles as Role, Menus as Menu } from '../../../model-layer';
import { IMenus } from '../../../business-layer';
import { Payload } from '../../exporter';

@injectable()
@controller('/menus')
export class MenuController {
  private _menus: IMenus;
  constructor( @inject('Menus') roles: IMenus) {
    this._menus = roles;
  }

  @httpPost('/')
  public async addMenu(request: Request): Promise<any> {
    let menu = new Menu();
    menu.title = request.body['title'];
    let res = await this._menus.addMenu(menu);
    return res;
  }

  @httpGet('/')
  public async get(): Promise<Menu[]> {
    let res = await this._menus.getMainMenus();
    return res;
  }

  @httpGet('/:id')
  public async getSubMenusByParentId(request: Request): Promise<Menu[]> {
    let res = await this._menus.getSubMenusByParentId(Number(request.params['id']));
    return res
  }

  @httpPut('/')
  public async updateMenu(request: Request): Promise<Menu> {
    let res = await this._menus.update(request.body);
    return res;
  }

  @httpDelete('/:id')
  public async deleteMenu(request: Request): Promise<Menu> {
    let res = await this._menus.removeById(Number(request.params['id']));
    return res;
  }

}
