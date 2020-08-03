import { Server } from "http";
import SocketIO from 'socket.io';
import sockets from "../sockets";
import { Container } from 'typedi';
import Logger from "../services/logger";

export default async (server: Server) => {
    const logger = Container.get(Logger);

    //start socketio and register with typedi
    const io = SocketIO.listen(server);
    Container.set('socket-server', io);

    //socket routes
    sockets(io);
    logger.info("Socket.io Loaded")
}