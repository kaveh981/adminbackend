import { Clients, Employees } from '../../../model-layer';

interface IClients {
    addClientToUser(employeeId: Number): Promise<Clients>
    storeToken(data: any, cb);
    findClientByToken(data: any): Promise<{ error: Error, user: { userId, clientId } }>
    rejectToken(data: any): Promise<Error>
}
export { IClients };
