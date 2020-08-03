import { Service, Container } from 'typedi';
import Speaker from '../resources/speaker';
import { Socket } from 'socket.io';
import Logger from './logger';
const logger = Container.get(Logger);

//Speaker service
//TODO: save memory by actually deleting disabled speakers after some time

@Service()
export default class SpeakerService {
    
    private speakers: Speaker[];

    constructor() {
        this.speakers = [];
        logger.info("Speaker service started.")
    }

    createSpeaker(name: string) {
        let speaker = new Speaker(name);
        this.speakers.push(speaker);
        return speaker.getId();
    }

    claimSpeaker(id: string, writerId: string) {
        //Make sure user doesnt lay claim to any other speakers
        for (let i=0; i<this.speakers.length; i++) {
            let speaker = this.speakers[i];
            if (speaker.getWriter()?.getId() === writerId) {
                return false;
            }
        }

        //Claim if available
        for (let i=0; i<this.speakers.length; i++) {
            let speaker = this.speakers[i];
            if (speaker.getId() === id) {
                if (this.speakers[i].getWriter()) {
                    return false;
                }
                this.speakers[i].claim(writerId);
                return true;
            }
        }

        //If speaker doesn't exist
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

    //Send all active speakers to a socket (used for filling data for new connections)
    sendAll(socket: Socket) {
        for (let i=0; i<this.speakers.length; i++) {
            this.speakers[i].sendUpdate(socket);
        }
    }
}