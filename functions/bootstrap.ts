import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { container } from './container';
import * as firebase from "firebase";
import * as functions from 'firebase-functions';
// create server
let server = new InversifyExpressServer(container);
server.setConfig((app) => {

  app.use(container.get<express.RequestHandler>('verifyUser'));
  // add body parser
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  // this is to allow cors
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });

  app.use(container.get<any>('errorHandler'));

});

let config = {
  apiKey: "AIzaSyAkdO4EymxL81Iik6MJCUPfpFu8sDvL8dI",
  authDomain: "shareit-f1f8a.firebaseapp.com",
  databaseURL: "https://shareit-f1f8a.firebaseio.com",
  projectId: "shareit-f1f8a",
  storageBucket: "",
};
firebase.initializeApp(config);
if (process.env.OPENSHIFT_NODEJS_IP) {
  console.log('new ' + JSON.stringify(process.env.OPENSHIFT_NODEJS_IP));
}

let app = server.build();
exports.app = functions.https.onRequest(app);
// let port: number = Number.parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 8080;
// let ip = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
// app.listen(port, ip);
// app.get('/', function (req, res) {
//   res.send('Hello Kaveh!' + `, Server started on port ${port} and ip of ${ip} :)`);
// });
// console.log(`Server started on port ${port} and ip of ${ip} :)`);


