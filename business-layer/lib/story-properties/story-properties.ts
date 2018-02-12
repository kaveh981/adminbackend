import { injectable, inject } from 'inversify';
import { StoryPropNames, StoryProperties as StoryProperty } from '../../../model-layer';
import { GenericRepository } from '../../../data-layer';
import { IStoryProperties } from './story-properties.infc';
import { BusinessLayerHelper } from '../helper';
import { IUsers } from '../users/users.infc';


@injectable()
class StoryProperties implements IStoryProperties {

    constructor( @inject('GenericRepository') private repo: GenericRepository<any>,
        @inject('BusinessLayerHelper') private helper: BusinessLayerHelper, @inject('Users') private users: IUsers) { }

    public async addPropertyName(propertyName: AddPropertyName): Promise<StoryPropNames> {
        let creater = await this.users.getUserById(propertyName.creatorId);
        let newPropertyName = new StoryPropNames();
        newPropertyName.creator = creater;
        newPropertyName.propertyName = propertyName.propertyName;
        newPropertyName.status = propertyName.status;
        return await this.repo.save(propertyName);
    }
    public async getPropNameById(propNameId: number): Promise<StoryPropNames> {
        let result: StoryPropNames = await this.repo.getSingle(StoryPropNames, {
            where: {
                "propertyNameId": propNameId
            }
        });
        return result;
    }
    public async getPropNames(propName: string, take: number): Promise<StoryPropNames[]> {
        let repo = await this.repo.getRepository(StoryPropNames)
        let db = await repo.createQueryBuilder('StoryPropNames');
        return db.where(`StoryPropNames.propertyName LIKE '%${propName}%'`)
            .orderBy('propertyName')
            .take(take)
            .getMany();
    }

}
export { StoryProperties };


