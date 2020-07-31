import http from 'http';
import socketio from './socketio';
import express from 'express';
import routes from '../routes';
import config from '../config';

export default async () => {
    const app = express();

    const server = http.createServer(app);

    //Start socket stuff
    socketio(server);

    //Load express routes TODO: add pages to these routes
    routes(app);

    server.listen(config.port);
}