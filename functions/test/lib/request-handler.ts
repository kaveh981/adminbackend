'use strict';

/** node_modules */
import * as request from 'request';
import * as Promise from 'bluebird';
// import * as jwt from 'jsonwebtoken';

import { injectable, inject } from 'inversify';


@injectable()
class APIRequestHandler {

    /**
     * Constructor
     * configLoader - An instance of the ConfigLoader.
     */
    constructor( @inject('ApiConfig') private config: any) {
        this.config = config;
    };

    /**
     * Send a get request to the path with given params and userID.
     * @param path - The path to send to, relative to the base domain.
     * @param params - The query string parameters.
     */
    public get(path: string, params?: any) {

        let headers: any;
        return this.sendRequest(this.config['baseDomain'], path, 'GET', params, headers);

    }

    /**
     * Send a put request to the path with given body and userID.
     * @param path - The path to send to, relative to the base domain.
     * @param body - The JSON body.
     */
    public put(path: string, body: any) {

        let headers: any;

        return this.sendRequest(this.config['baseDomain'], path, 'PUT', body, headers);

    }

    /**
     * Send a delete request to the path with given params and userID.
     * @param path - The path to send to, relative to the base domain.
     * @param params - The query string parameters.
     */
    public delete(path: string, params: any) {

        let headers: any;

        return this.sendRequest(this.config['baseDomain'], path, 'DELETE', undefined, headers);

    }

    /**
     * Send a post request to the path with given params and userID.
     * @param path - The path to send to, relative to the base domain.
     * @param params - The query string parameters.
     */
    public post(path: string, body: any) {

        let headers: any;

        return this.sendRequest(this.config['baseDomain'], path, 'POST', body, headers);

    }

    /**
     * Send request function, to clean up the code.
     * @param domain - The domain to send the request to.
     * @param uri - The URI to send the request to, relative to domain.
     * @param verb - The verb to use.
     * @param body - The body (or query if GET) to send.
     * @param headers - The headers to send.
     * @returns The response from the server.
     */
    public sendRequest(domain: string, uri: string, verb: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS', body?: any, headers?: any) {
        return new Promise((resolve: ({ status: number, body: any }) => any, reject) => {

            let options = {
                baseUrl: domain,
                [verb === 'GET' ? 'qs' : 'body']: body,
                uri: uri,
                method: verb,
                headers: headers,
                json: true
            };

            console.log(`Sending ${verb} request to ` + uri);
            console.log('Options: ' + JSON.stringify(options));

            request(options, (error, response, resBody) => {
                if (error) {
                    reject(error);
                    return;
                }
                console.log(JSON.stringify(resBody));
                resolve({ status: response.statusCode, body: resBody });
            });

        });
    }

    public getBaseURL() {
        return this.config['baseDomain'];
    }

}

export { APIRequestHandler }
