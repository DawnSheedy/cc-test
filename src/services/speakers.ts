import { Service, Container } from 'typedi';
import Speaker from '../resources/speaker';
import { Socket } from 'socket.io';

@Service()
export default class SpeakerService {
    
    private speakers: Speaker[];

    constructor() {
        this.speakers = [];
    }

    createSpeaker(name: string) {
        let speaker = new Speaker(name);
        this.speakers.push(speaker);
        return speaker.getId();
    }

    claimSpeaker(id: string, writerId: string) {
        for (let i=0; i<this.speakers.length; i++) {
            let speaker = this.speakers[i];
            if (speaker.getId() === id) {
                this.speakers[i].claim(writerId);
                return true;
            }
        }
        return false;
    }

    findSpeaker(id: string): Speaker | null {
        for (let i=0; i<this.speakers.length; i++) {
            let speaker = this.speakers[i];
            if (speaker.getId() === id) {
                return this.speakers[i];
            }
        }
        return null;
    }

    releaseSpeaker(id: string) {
        for (let i=0; i<this.speakers.length; i++) {
            let speaker = this.speakers[i];
            if (speaker.getId() === id) {
                this.speakers[i].release();
                return;
            }
        }
    }

    deleteSpeaker(id: string) {
        for (let i=0; i<this.speakers.length; i++) {
            let speaker = this.speakers[i];
            if (speaker.getId() === id) {
                this.speakers[i].disable();
                return;
            }
        }
    }

    sendAll(socket: Socket) {
        for (let i=0; i<this.speakers.length; i++) {
            this.speakers[i].sendUpdate(socket);
        }
    }
}