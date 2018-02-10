
import {Users} from '../../../model-layer';

interface IUsers {
    getUserById(userId: number): Promise<Users>;
}
export { IUsers };




