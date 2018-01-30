import { injectable, inject } from 'inversify';
import { AppUsers as AppUser, Users as User } from '../../../model-layer';
import { GenericRepository } from '../../../data-layer';
import { IAppUsers } from './app-users.infc';
import { BusinessLayerHelper } from '../helper';


@injectable()
class AppUsers implements IAppUsers {

    constructor( @inject('GenericRepository') private repo: GenericRepository<any>,
        @inject('BusinessLayerHelper') private helper: BusinessLayerHelper) { }

    public async authenticate(appUser: AppUserRegister): Promise<any> {
        let result: AppUser = await this.repo.getSingle(AppUser, {
            relations: ["user"],
            where: {
                "externalAppUserId": appUser.externalAppUserId
            }
        });
        if (appUser.appID && appUser.appID !== '1:264292606260:android:334752b62c4bdab7') {
            return {
                message: 'Wrong app Id', user: null
            }
        }
        if (result) {
            return {
                message: null, user: {
                    id: result.user.userId,
                    firstname: result.user.name,
                    verified: true
                }
            };

        } else if (!result) {
            let user = new User();
            user.name = appUser.name;
            user.family = ' ';
            let _appUser = new AppUser();
            _appUser.phoneNumber = appUser.phoneNumber;
            _appUser.externalAppUserId = appUser.externalAppUserId;
            user.appUser = _appUser;
            return this.addAppUser(user).then(res => {
                return {
                    message: null, user: {
                        id: res.userId,
                        firstname: res.name,
                        verified: true
                    }
                };
            }).catch(error => {
                return {
                    message: error, user: null
                };
            })

        } else {
            return {
                message: 'Wrong phone number', user: null
            };
        }
    }

    public async  addAppUser(user: User): Promise<User> {
        let result: any = await this.repo.save(user);
        return result;
    }
}
export { AppUsers };


