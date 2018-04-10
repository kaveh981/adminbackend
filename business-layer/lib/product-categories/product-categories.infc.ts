
import { Employees as Employee, Users as User } from '../../../model-layer';

interface IProductCategories {
    AddProductCategory(productCategory: AddProductCategory): Promise<any>;
    getCategoryByParentId(filterCategory: GetCategory): Promise<any>;
    update(productCategory: AddProductCategory): Promise<ReturnStatus>;
    delete(productCategory: AddProductCategory): Promise<ReturnStatus>;
}
export { IProductCategories };






