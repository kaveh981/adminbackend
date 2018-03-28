import { controller, httpGet, httpPost, httpPut, httpDelete } from 'inversify-express-utils';
import { injectable, inject, Container } from 'inversify';
import * as express from 'express';
import { Request, Response } from 'express';
import { Employees as Employee, Users as User } from '../../../model-layer';
import { IEmployees } from '../../../business-layer';
import { Payload } from '../../exporter';
import { Strategy, ExtractJwt, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import * as passport from 'passport';
let JwtStrategy = require('passport-jwt').Strategy;

export function controllerFactory(container: Container) {

    @injectable()
    @controller('/membership')
    class MembershipController {
        private _employees: IEmployees;
        constructor( @inject('Employees') employees: IEmployees) {
            this._employees = employees;
            //  membership.passportUse();
        }

        @httpPost('/login',
            container.get<express.RequestHandler>('serializeUser'),
            container.get<express.RequestHandler>('serializeClient'),
            container.get<express.RequestHandler>('generateToken'),
            container.get<express.RequestHandler>('generateRefreshToken'),
            container.get<express.RequestHandler>('respond'))
        public async login(request: Request, response: Response): Promise<any> {
            return response.send('login');
        }

        @httpPost('/LoginApp',
            container.get<express.RequestHandler>('serializeAppUser'),
            container.get<express.RequestHandler>('serializeClient'),
            // container.get<express.RequestHandler>('generateToken'),
            // container.get<express.RequestHandler>('generateRefreshToken'),
            container.get<express.RequestHandler>('appRespond'))
        public async loginApp(request: Request, response: Response): Promise<any> {
            return response.send('login');
        }

        @httpPost('/token',
            container.get<express.RequestHandler>('validateRefreshToken'),
            container.get<express.RequestHandler>('generateToken'),
            container.get<express.RequestHandler>('respondToken'))
        public async generateToken(req: express.Request, res: express.Response) {
            res.status(200).json({
                hello: 'login world'
            });
        }

        @httpPost('/token/reject',
            container.get<express.RequestHandler>('rejectToken'),
            container.get<express.RequestHandler>('respondReject'))
        public async rejectToken(req: express.Request, res: express.Response) {
            res.status(200).json({
                hello: 'login world'
            });
        }

    }
    return <any>MembershipController;
}