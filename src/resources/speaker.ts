import { randomBytes } from "crypto";
import { Container } from 'typedi';
import { Server, Socket } from "socket.io";
import { send } from "process";
import WriterService from "../services/writers";
import Writer from "./writer";

class Speaker {
    private name: string;
    private status: boolean;
    private claimedBy: Writer | null;
    private available: boolean;
    private id: string;

    constructor(name: string) {
        this.name = name;
        this.claimedBy = null;
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
        this.claimedBy = null;
        this.sendUpdate()
    }

    getWriter() {
        return this.claimedBy;
    }

    isAvailable() {
        return this.available;
    }

    claim(writer: string) {
        const writerService = Container.get(WriterService);
        console.log('test3')
        this.claimedBy = writerService.findWriter(writer);
        console.log('test4')
        this.available = false;
        this.sendUpdate()
    }

    release() {
        this.claimedBy = null;
        this.available = true;
        this.sendUpdate()
    }

    generateUpdate() {
        return {
            name: this.name,
            writer: this.claimedBy?.generateUpdate(),
            available: this.available,
            status: this.status,
            id: this.id
        }
    }

    sendUpdate(socket?: Socket) {
        let io: Server = Container.get('socket-server');
        let output = this.generateUpdate();
        if (socket) {
            socket.emit('speaker', output);
        } else {
            io.emit('speaker', output);
        }
    }
}

export default Speaker;