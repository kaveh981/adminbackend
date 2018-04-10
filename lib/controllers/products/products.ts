import { controller, httpGet, httpPost, httpPut, httpDelete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request } from 'express';
import { Employees as Employee, Roles as Role } from '../../../model-layer';
import { IProductCategories } from '../../../business-layer';
import { Payload } from '../../exporter';

@injectable()
@controller('/products')
export class ProductController {

    constructor( @inject('ProductCategories') private productCategories: IProductCategories) {
    }

    @httpPost('/category')
    public async add(request: Request): Promise<any> {
        let res = await this.productCategories.AddProductCategory({
            creatorId: request['user'].id,
            category: request.body['category'],
            status: request.body['status'] || Status.active,
            parentCategoryId: request.body['parentId']
        });
        console.log(res);
        console.log({ name: res.name, id: res.id, hasChildren: false });
        return { name: res.name, id: res.id, hasChildren: false };
    }

    @httpGet('/category/parent/:id')
    public async get(request: Request): Promise<any> {
        console.log(request.params['id']);
        let res = await this.productCategories.getCategoryByParentId({
            parentCategoryId: request.params['id'] === 0 ? null : request.params['id'],
            status: null
        });
        return res.map((e) => Payload.getProductCategories(e));
    }


    @httpPut('/category')
    public async update(request: Request): Promise<any> {
        let res = await this.productCategories.update(request.body);
        return res;
    }

    @httpDelete('/category/:id')
    public async delete(request: Request): Promise<any> {
        let res = await this.productCategories.update(request.body);
        return res;
    }

}
