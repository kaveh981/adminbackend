import { injectable, inject } from 'inversify';
import { StoryPropNames, StoryProperties as StoryProperty, ProductCategories as ProductCategory, Employees as Employee } from '../../../model-layer';
import { GenericRepository } from '../../../data-layer';
import { } from './product-categories.infc';
import { BusinessLayerHelper } from '../helper';
import { IUsers } from '../users/users.infc';


@injectable()
class ProductCategories {

    constructor( @inject('GenericRepository') private repo: GenericRepository<any>,
        @inject('BusinessLayerHelper') private helper: BusinessLayerHelper, @inject('Users') private users: IUsers) { }

    public async AddProductCategory(productCategory: AddProductCategory): Promise<any> {
        try {
            console.log(productCategory);
            let creator = new Employee();
            creator.employeeId = productCategory.creatorId;
            let newCategory = new ProductCategory();
            newCategory.creator = creator;
            newCategory.name = productCategory.category;
            newCategory.status = productCategory.status;
            if (productCategory.parentCategoryId) {
                let parentCategory = new ProductCategory();
                parentCategory.id = productCategory.parentCategoryId
                newCategory.parent = parentCategory;
            }
            console.log(newCategory);
            let res = await this.repo.save(newCategory);
            console.log(res);
            return { name: res.name, id: res.id, hasChildren: false };
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }

    public async getCategoryByParentId(filterCategory: GetCategory): Promise<any> {

        let repo = await this.repo.getTreeRepository(ProductCategory);
        let db = await repo.createQueryBuilder('productCategory');
        if (filterCategory.status) {
            db = db.where("productCategory.status = :status", { status: filterCategory.status })
        }
        if (filterCategory.parentCategoryId == 0 || !filterCategory.parentCategoryId) {
            db = db.where("productCategory.parentId IS NULL")
        }
        else {
            db = db.where("productCategory.parentId = :parentId", { parentId: filterCategory.parentCategoryId })
        }
        let res = await db
            .leftJoinAndSelect("productCategory.children", "children")
            .select(["productCategory.name", "productCategory.id", "children.id"])
            .orderBy('productCategory.name')
            .getMany();
        return res.map(root => {
            return {
                hasChildren: root.children.length > 0 ? true : false,
                name: root.name,
                id: root.id
            }
        });
    }

    public async  update(productCategory: AddProductCategory): Promise<ReturnStatus> {
        try {
            let repo = await this.repo.getRepository(ProductCategory)
            let result = await repo.createQueryBuilder('ProductCategories')
                .where("ProductCategories.categoryId = :categoryId", { categoryId: productCategory.categoryId })
                .getOne();
            result.category = productCategory.category;
            if (productCategory.parentCategoryId) {
                let parentCategory = new ProductCategory();
                parentCategory.id = productCategory.parentCategoryId
                result.parent = parentCategory;
            }
            result.status = productCategory.status;
            await this.repo.save(result);
            return { success: true, message: 'Updated' };
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }

    public async  delete(productCategory: AddProductCategory): Promise<ReturnStatus> {
        try {
            let repo = await this.repo.getRepository(ProductCategory)
            let result = await repo.createQueryBuilder('ProductCategories')
                .delete()
                .where("ProductCategories.categoryId = :categoryId", { categoryId: productCategory.categoryId });
            await this.repo.save(result);
            return { success: true, message: 'Deleted' };
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }

}
export { ProductCategories };


