import { injectable, inject } from 'inversify';
import { Users as User} from '../../../model-layer';
import { GenericRepository } from '../../../data-layer';
import { IUsers } from './users.infc';
import { BusinessLayerHelper } from '../helper';


@injectable()
class Users implements IUsers {

    constructor( @inject('GenericRepository') private repo: GenericRepository<any>) { }
    public async getUserById(userId: number): Promise<User> {
        let result: User = await this.repo.getSingle(User, {
            where: {
                "userId": userId
            }
        });
        return result;
    }

}
export { Users };


