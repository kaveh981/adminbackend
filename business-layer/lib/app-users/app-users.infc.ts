
import { AppUsers as AppUser, Users as User } from '../../../model-layer';


interface IAppUsers {
    authenticate(appUser: AppUserRegister): Promise<any>
}
export { IAppUsers };






