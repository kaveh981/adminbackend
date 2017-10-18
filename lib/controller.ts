import * as express from "express";
import { interfaces, controller, httpGet, request, response } from "inversify-express-utils";
import { injectable, inject } from "inversify";

@controller("/foo")
@injectable()
export class FooController implements interfaces.Controller {

    constructor( ) {}

    @httpGet("/")
    private index(req: express.Request, res: express.Response, next: express.NextFunction): string {
        return 'hello world!';
    }
}
