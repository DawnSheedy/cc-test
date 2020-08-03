import { randomBytes } from "crypto";
import { Container } from 'typedi';
import { Server, Socket } from "socket.io";
import { send } from "process";
import Logger from "../services/logger";
const logger = Container.get(Logger);

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
        logger.info(`New writer: \n${JSON.stringify(this.generateUpdate())}`)
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
        logger.info(`Writer ${this.id} disabled.`);
        this.sendUpdate()
    }

    generateUpdate() {
        return {
            name: this.name,
            status: this.status,
            id: this.id
        }
    }

    sendUpdate(socket?: Socket) {
        let io: Server = Container.get('socket-server');
        let output = this.generateUpdate();
        if (socket) {
            socket.emit('writer', output);
        } else {
            io.emit('writer', output);
        }
    }
}

export default Writer;