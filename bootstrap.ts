import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { container } from './container';
import * as admin from 'firebase-admin';
import { FirebaseConfig } from "./firebase-config";
let config = require('shush')('../assets/middleware.json');
let meddleware = require('meddleware');
let cors = require('cors')
let nodemon = require('nodemon');

// create server
let server = new InversifyExpressServer(container);


admin.initializeApp({
  credential: admin.credential.cert(FirebaseConfig),
  databaseURL: 'https://chelpa-sms-verification.firebaseio.com'
});

if (process.env.OPENSHIFT_NODEJS_IP) {
  console.log('new ' + JSON.stringify(process.env.OPENSHIFT_NODEJS_IP));
}

if (process.env.PORT) {
  console.log('new ' + JSON.stringify(process.env.PORT));
}

//let app = server.build();

let port: number = normalizePort(process.env.OPENSHIFT_NODEJS_PORT || '8080');
let ip = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
// let port: number = normalizePort(process.env.PORT || '8080');
// let ip = process.env.IP || '0.0.0.0';
// app.listen(port, ip);

server.setConfig((app) => {
  app.use(container.get<any>('errorHandler'));
  app.use(cors());
  // app.use(meddleware(config));
  app.use(container.get<express.RequestHandler>('verifyUser'));
  //add body parser
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
}).setErrorConfig((app) => {
  app.use((err: Error, req, res, next) => {
    console.log(err.stack);
    console.log(err.name);
    console.log('message: ' + err.message);
    res.status(500).send(err.message);
  });
});

let app = server.build();
app.listen(port, 'localhost');

app.get('/', function (req, res) {
  res.send('Hello Kavehhhhh!' + `, Server started on port ${port} and ip of ${ip} :)`);
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
  console.log('on errorrrrrr');
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

app.on('error', onError)
// Handle normal exits
process
  .on('exit', (code) => {
    console.log('nodemon exit1');
    nodemon.emit('quit');
    process.exit(code);
  })

  // Handle CTRL+C
  .on('SIGINT', () => {
    console.log('nodemon exit2');
    nodemon.emit('quit');
    process.exit(0);
  })

  .on('unhandledRejection', (err) => {
    console.log('unhandledRejection ' + err)
  })

  .on('uncaughtException', onError);