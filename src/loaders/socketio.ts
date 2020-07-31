import { Server } from "http";
import SocketIO from 'socket.io';
import sockets from "../sockets";
import { Container } from 'typedi';

export default async (server: Server) => {

    //start socketio and register with typedi
    const io = SocketIO.listen(server);
    Container.set('socket-server', io);

    //socket routes
    sockets(io);
}