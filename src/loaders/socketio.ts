import { Server } from "http";
import SocketIO from 'socket.io';
import sockets from "../sockets";
import { Container } from 'typedi';

export default async (server: Server) => {
    const io = SocketIO.listen(server);
    Container.set('socket-server', io);
    sockets(io);
}