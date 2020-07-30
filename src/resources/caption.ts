import { randomBytes } from "crypto";
import { Container } from 'typedi';
import { Server } from "socket.io";
import Writer from "./writer";
import Speaker from "./speaker";
import SpeakerService from "../services/speakers";

class Caption {
    private caption: string;
    private writer: Writer | null;
    private speaker: Speaker | null;
    private cancelled: boolean;
    private id: string;

    constructor(speakerId: string, writerId: string, caption: string) {
        let speakerService = Container.get(SpeakerService);
        this.caption = caption;
        this.speaker = speakerService.findSpeaker(speakerId);
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

    sendUpdate() {
        let io: Server = Container.get('socket-server');
        let output = {
            name: this.name,
            writer: this.claimedBy,
            available: this.available,
            status: this.status,
            id: this.id
        }
        io.emit('speaker', output);
    }
}

export default Speaker;