import { randomBytes } from "crypto";
import { Container } from 'typedi';
import { Server, Socket } from "socket.io";
import { send } from "process";

class Speaker {
    private name: string;
    private status: boolean;
    private claimedBy: string;
    private available: boolean;
    private id: string;

    constructor(name: string) {
        this.name = name;
        this.claimedBy = "";
        this.status = true;
        this.available = true;
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
        this.available = false;
        this.claimedBy = "";
        this.sendUpdate()
    }

    getWriter() {
        return this.claimedBy;
    }

    isAvailable() {
        return this.available;
    }

    claim(writer: string) {
        this.claimedBy = writer;
        this.available = false;
        this.sendUpdate()
    }

    release() {
        this.claimedBy = '';
        this.available = true;
        this.sendUpdate()
    }

    sendUpdate(socket?: Socket) {
        let io: Server = Container.get('socket-server');
        let output = {
            name: this.name,
            writer: this.claimedBy,
            available: this.available,
            status: this.status,
            id: this.id
        }
        if (socket) {
            socket.emit('speaker', output);
        } else {
            io.emit('speaker', output);
        }
    }
}

export default Speaker;