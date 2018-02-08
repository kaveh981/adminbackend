import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { container } from './container';

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

if (process.env.PORT) {
  console.log('new ' + JSON.stringify(process.env.PORT));
}

let app = server.build();

let port: number = normalizePort(process.env.PORT || '8080');
let ip = process.env.IP || '0.0.0.0';
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

