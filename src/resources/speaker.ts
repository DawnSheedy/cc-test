import { randomBytes } from "crypto";
import { Container } from 'typedi';
import { Server, Socket } from "socket.io";
import { send } from "process";
import WriterService from "../services/writers";
import Writer from "./writer";
import Logger from "../services/logger";
const logger = Container.get(Logger);

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
        logger.info(`New speaker: \n${JSON.stringify(this.generateUpdate())}`)
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
        logger.info(`Speaker ${this.id} disabled.`);
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
        this.claimedBy = writerService.findWriter(writer);
        this.available = false;
        logger.info(`Speaker ${this.id} claimed by writer: ${writer}`);
        this.sendUpdate()
    }

    release() {
        this.claimedBy = null;
        this.available = true;
        logger.info(`Speaker ${this.id} released.`);
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