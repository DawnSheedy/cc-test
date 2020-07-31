import { randomBytes } from "crypto";
import { Container } from 'typedi';
import { Server, Socket } from "socket.io";
import { send } from "process";

class Writer {
    private name: string;
    private status: boolean;
    private id: string;
    private socket: Socket;

    constructor(name: string, socket: Socket) {
        this.name = name;
        this.status = true;
        this.socket = socket;
        this.id = randomBytes(20).toString('hex');
        this.sendUpdate();
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getStatus() {
        return this.status;
    }

    disable() {
        this.status = false;
        this.socket.disconnect(true);
        this.sendUpdate()
    }

    sendUpdate(socket?: Socket) {
        let io: Server = Container.get('socket-server');
        let output = {
            name: this.name,
            status: this.status,
            id: this.id
        }

        if (socket) {
            socket.emit('writer', output);
        } else {
            io.emit('writer', output);
        }
    }
}

export default Writer;