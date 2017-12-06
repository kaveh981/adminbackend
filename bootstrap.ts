import 'reflect-metadata';
import * as bodyParser from 'body-parser';

import { Container } from 'inversify';
import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { container } from './container';

// create server
let server = new InversifyExpressServer(container);
server.setConfig((app) => {
  // add body parser
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  // this is to allow cors
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
});
console.log('new' + JSON.stringify(process.env.OPENSHIFT_NODEJS_IP));
let app = server.build();
let port: number = Number.parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 3000;
let ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
app.listen(port, ip);
console.log(`Server started on port ${port} and ip of ${ip} :)`);


