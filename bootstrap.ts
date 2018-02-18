import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { container } from './container';
import * as admin from 'firebase-admin';
import { FirebaseConfig } from "./firebase-config";
let cors = require('cors')

// create server
let server = new InversifyExpressServer(container);
server.setConfig((app) => {

  // this is to allow cors
  app.use(cors());
 
  app.use(container.get<express.RequestHandler>('verifyUser'));
  // add body parser
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.use(container.get<any>('errorHandler'));

});

admin.initializeApp({
  credential: admin.credential.cert(FirebaseConfig),
  databaseURL: 'https://chelpa-sms-verification.firebaseio.com'
});

console.log('new' + JSON.stringify(process.env.OPENSHIFT_NODEJS_IP));


if (process.env.PORT) {
  console.log('new ' + JSON.stringify(process.env.PORT));
}

let app = server.build();

let port: number = normalizePort(process.env.OPENSHIFT_NODEJS_PORT || '8080');
let ip = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
// let port: number = normalizePort(process.env.PORT || '8080');
// let ip = process.env.IP || '0.0.0.0';
app.listen(port, ip);
app.on('error', onError);
app.get('/', function (req, res) {
  res.send('Hello Kaveh!' + `, Server started on port ${port} and ip of ${ip} :)`);
});
console.log(`Server started on port ${port} and ip of ${ip} :)`);



app.set('port', port);
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}



/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

