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
});

let app = server.build();
app.listen(3000);