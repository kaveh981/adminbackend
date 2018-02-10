
import { AppUsers as AppUser, Users as User } from '../../../model-layer';


interface IAppUsers {
    authenticate(appUser: AppUserRegister): Promise<any>
    findAppUserById(id: number): Promise<AppUser>
}
export { IAppUsers };






