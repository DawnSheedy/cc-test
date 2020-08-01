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

        this.cleanCaption();
        //Set 5 second timer to send a caption to the stream after creation
        setTimeout(this.submit.bind(this), 5000);

        this.sendUpdate();
    }

    cleanCaption() {
        //Remove extra spaces :)
        this.caption = this.caption.trim();
        this.caption = this.caption.replace(/ +(?= )/g,'');
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

    generateUpdate() {
        return {
            caption: this.caption,
            writer: this.writer?.generateUpdate(),
            speaker: this.speaker?.generateUpdate(),
            cancelled: this.cancelled,
            sent: this.sent,
            id: this.id
        }
    }

    sendUpdate() {
        let io: Server = Container.get('socket-server');
        let output = this.generateUpdate();
        io.emit('caption', output);
    }
}

export default Caption;