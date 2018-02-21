import { IEmployees, IClients, IAppUsers } from '../business-layer';
import { Users, Employees, AppUsers } from '../model-layer';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import * as admin from 'firebase-admin';
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const TOKENTIME = 120 * 60; // in seconds

@injectable()
class Middlewares {

    constructor( @inject('Employees') private employee: IEmployees, @inject('AppUsers') private appUser: IAppUsers,
        @inject('Clients') private client: IClients, @inject('Secret') private secret) { }

    public verifyUser = (req, res, next) => {
        if (/(mmmmm)/.test(req.originalUrl) || req.path === '/') {
            console.log('No authentication needed');
            return next();
        }
        if (/(membership)/.test(req.originalUrl) || req.path === '/') {
            console.log('No authentication needed membership');
            return next();
        } else {
            const jwt = require('jsonwebtoken');
            console.log(req.headers);
            let u = jwt.verify(req.headers.authorization.toString().replace('bearer ', ''), this.secret, (error, user) => {
                if (error) {
                    return next(error)
                }
                console.log('verified');
                req.user = req.user || {};
                req.user.id = user.id;
                next();
            })
        }
    }

    public verifyAppUser = (req, res, next) => {
        if (/(membership)/.test(req.originalUrl) || req.path === '/') {
            console.log('No authentication needed');
            return next();
        }
        if (/(stories)/.test(req.originalUrl) || req.path === '/')
            return next();
        if (/(employees)/.test(req.originalUrl) || req.path === '/') {
            console.log('No authentication needed');
            return next();
        } else {
            // const firebaseConfig = {
            //     apiKey: "AIzaSyAVREAUgG53zTYKUGUYI81IZPq5g-205DI",
            //     authDomain: "chelpa-sms-verification.firebaseapp.com",
            //     databaseURL: "https://chelpa-sms-verification.firebaseio.com",
            //     projectId: "chelpa-sms-verification",
            //     storageBucket: "chelpa-sms-verification.appspot.com",
            //     messagingSenderId: "264292606260"
            // };

            // console.log(FirebaseConfig);
            // admin.initializeApp({
            //     credential: admin.credential.cert(FirebaseConfig),
            //     databaseURL: 'https://chelpa-sms-verification.firebaseio.com'
            // });

            admin.auth().verifyIdToken(req.headers.authorization.toString())
                .then(function (decodedToken) {
                    req.user = req.user || {};
                    req.user.appid = decodedToken.uid;
                    next();
                }).catch(function (error) {
                    return next(error)
                });
        }
    }

    public serializeUser = (req, res, next) => {
        let result = this.employee.authenticate(req.body['username'], req.body['password']);
        result.then((user) => {
            if (user.message) {
                return next(user.message);
            }
            req.user = req.user || {};
            req['user']['userId'] = user.user.id;
            next();
        }).catch(error => {
            return next(error);
        })
    }

    public serializeAppUser = (req, res, next) => {
        let result = this.appUser.authenticate({
            appID: req.body['appID'], externalAppUserId: req.body['externalAppUserId'],
            phoneNumber: req.body['phoneNumber'], name: req.body['name']
        });
        result.then((user) => {
            console.log(user);
            if (user.message) {
                return next(user.message);
            }
            req.user = req.user || {};
            req['user']['userId'] = user.user.id;
            next();
        }).catch(error => {
            return next(error);
        })
    }

    public serializeClient = (req, res, next) => {
        if (req.query.permanent === 'true') {
            this.client.addClientToUser(
                req['user']['userId']).then((client) => {
                    req['user']['clientId'] = client.clientId;
                    next();
                }).catch((err) => {
                    return next(err);
                });
        }
    }

    public generateToken = (req, res, next) => {
        req.token = req.token || {};
        req['token']['accessToken'] = jwt.sign({
            id: req['user']['userId']
        }, this.secret, {
                expiresIn: TOKENTIME
            });
        next();
    }

    public generateRefreshToken = (req, res, next) => {
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

    public appRespond = {
        auth: (req, res) => {
            res.status(200).json({
                user: req.user
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
                next(res.error);
            }
            else {
                req.user = res.user;
                next();
            }
        }).catch(error => {
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

    public errorHandler = (error: Error, req, res, next) => {
        console.error(error.message)
        res.status(500).send(error.name + ' ' + error.message);
    }
}
export { Middlewares };
