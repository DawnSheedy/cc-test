import { Server } from "http";
import SocketIO from 'socket.io';

export default async (server: Server) => {
    const io = SocketIO.listen(server);
}