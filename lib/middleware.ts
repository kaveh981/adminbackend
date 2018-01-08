import { container } from '../container';
import { IEmployees, IClients } from '../business-layer';
import { Users, Employees } from '../model-layer';
import * as express from 'express';
import { inject, injectable } from 'inversify';
const crypto = require('crypto');
//const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const SECRET = 'server secret';
const TOKENTIME = 120 * 60; // in seconds

@injectable()
class MembershipMiddleware {

    constructor( @inject('Employees') private employee: IEmployees,
        @inject('Clients') private client: IClients) { }

    public serializeUser = (req, res, next) => {
        console.log('---------------------........ serialize User ' + req.body['username']);
        let result = this.employee.authenticate(req.body['username'], req.body['password']);
        result.then((user) => {
            if(user.message){
                return next(user.message);
            }
           // console.log(user.user);
            console.log('user id: ' + user.user.id)
            req.user = req.user || {};
            req['user']['userId'] = user.user.id;
            next();
        }).catch(error => {
            return next(error);
        })
    }

    public serializeClient = (req, res, next) => {
        console.log(req['user'] + ' ---------------------........ serialize Client ' + JSON.stringify(req.body));
        if (req.query.permanent === 'true') {
            this.client.addClientToUser(
                req['user']['userId']).then((client) => {
                    req['user']['clientId'] = client.clientId;
                    console.log('----------++++' + client.clientId);
                    next();
                }).catch((err) => {
                    console.log('------------' + err);
                    return next(err);
                });
        }
    }

    public generateToken = (req, res, next) => {
        console.log('generate tokennnnnn');
        console.log('---------------------........ generate token ' + JSON.stringify(req['user']));
        req.token = req.token || {};
        req['token']['accessToken'] = jwt.sign({
            id: req['user']['userId']
        }, SECRET, {
                expiresIn: TOKENTIME
            });
        next();
    }

    public generateRefreshToken = (req, res, next) => {
        console.log('---------------------........ generate refresh token ' + JSON.stringify(req['user']));
        if (req.query.permanent === 'true') {
            req['token']['refreshToken'] = req.user.clientId.toString() + '.' + crypto.randomBytes(
                40).toString('hex');
            this.client.storeToken({
                clientId: req.user.clientId,
                refreshToken: req.token.refreshToken
            }, next);
        } else {
            next();
        }
    }

    public respond = {
        auth: (req, res) => {
            console.log('---------------------........ respond auth' + JSON.stringify(req.body));
            res.status(200).json({
                user: req.user,
                token: req.token
            });
        },
        token: (req, res) => {
            res.status(201).json({
                token: req.token
            });
        },
        reject: (req, res) => {
            res.status(204).end();
        }
    };

    public validateRefreshToken = (req, res, next) => {
        let result = this.client.findClientByToken(req.body.refreshToken);
        result.then(res => {
            if (res.error) {
                console.log('errrrrrr');
                next(res.error);
            }
            else {
                console.log(res.user);
                console.log('before next');
                req.user = res.user;
                next();
                console.log('after next');
            }
        }).catch(error => {
            console.log('errrrrrrorrrr');
           return next(error);
        })
    }

    public rejectToken = (req, res, next) => {
        this.client.rejectToken(req.body.refreshToken).then(res => {
            next();
        }).catch(error => {
           return next(error);
        });
    }
}
export { MembershipMiddleware };
