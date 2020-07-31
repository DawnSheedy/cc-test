import { randomBytes } from "crypto";
import { Container } from 'typedi';
import { Server } from "socket.io";
import Writer from "./writer";
import Speaker from "./speaker";
import SpeakerService from "../services/speakers";
import WriterService from "../services/writers";
import { isObject } from "util";

class Caption {
    private caption: string;
    private writer: Writer | null;
    private speaker: Speaker | null;
    private cancelled: boolean;
    private sent: boolean;
    private id: string;

    constructor(speakerId: string, writerId: string, caption: string) {
        let speakerService = Container.get(SpeakerService);
        let writerService = Container.get(WriterService);
        this.caption = caption;
        this.speaker = speakerService.findSpeaker(speakerId);
        this.writer = writerService.findWriter(writerId);
        this.cancelled = false;
        this.sent = false;
        this.id = randomBytes(20).toString('hex');
        setTimeout(this.submit, 5000);
        this.sendUpdate();
    }

    getId() {
        return this.id;
    }

    getCaption() {
        return this.caption;
    }

    isCancelled() {
        return this.cancelled;
    }

    disable() {
        this.cancelled = true;
        this.sendUpdate()
    }

    getWriter() {
        return this.writer;
    }
    
    getSpeaker() {
        return this.speaker;
    }

    submit() {
        if (this.cancelled) return;
        this.sent = true;
        this.sendUpdate();
    }

    sendUpdate() {
        let io: Server = Container.get('socket-server');
        let output = {
            caption: this.caption,
            writer: this.writer,
            speaker: this.speaker,
            cancelled: this.cancelled,
            sent: this.sent,
            id: this.id
        }
        io.emit('caption', output);
    }
}

export default Caption;