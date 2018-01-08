import { Clients as Client, Employees } from '../../../model-layer';
import { IClients } from './clients.infc';
import { inject, injectable } from 'inversify';
import { GenericRepository } from '../../../data-layer';

@injectable()
class Clients implements IClients {
    constructor( @inject('GenericRepository') private repo: GenericRepository<any>) { }
    public async addClientToUser(employeeId: Number): Promise<Client> {
        console.log(employeeId + 'add client ---------');
        let employee: Employees = await this.repo.getSingle(Employees, {
            where: {
                "employeeId": employeeId
            }
        });
        let client = new Client();
        client.employee = employee;
        return await this.repo.save(client);
    }

    public async storeToken(data: any, cb) {
        let client: Client = await this.repo.getSingle(Client, {
            where: {
                clientId: data.clientId
            }
        });
        console.log(JSON.stringify(data) + 'pppppppppp' + data.clientId);
        client.refreshToken = data.refreshToken;
        await this.repo.save(client);
        cb();
    }

    public async findClientByToken(refreshToken: string): Promise<{ error: Error, user: { userId, clientId } }> {
        console.log('data-----------------' + JSON.stringify(refreshToken));
        if (!refreshToken) {
            return { error: new Error('invalid token'), user: null };
        }
        let client: Client = await this.repo.getSingle(Client, {
            relations: ["employee"],
            where: {
                refreshToken: refreshToken
            }
        });
        if (client) {
            //console.log(client);
            return {
                error: null, user: {
                    userId: client.employee.employeeId,
                    clientId: client.clientId
                }
            };
        }
        return { error: new Error('not found'), user: null };
    }

    public async rejectToken(refreshToken: string): Promise<Error> {
        let client: Client = await this.repo.getSingle(Client, {
            where: {
                'refreshToken': refreshToken
            }
        });
        if (client) {
            await this.repo.remove([client]);
            return null;
        }
        return new Error('not found');
    }
}
export { Clients };

