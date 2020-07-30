import { Service, Container } from 'typedi';
import Writer from '../resources/writer';

@Service()
export default class WriterService {
    
    private speakers: Speaker[];

    constructor() {
        this.speakers = [];
    }

    createSpeaker(name: string) {
        this.speakers.push(new Speaker(name));
    }

    claimSpeaker(id: string, writerId: string) {
        for (let i=0; i<this.speakers.length; i++) {
            let speaker = this.speakers[i];
            if (speaker.getId() === id) {
                this.speakers[i].claim(writerId);
                return;
            }
        }
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
}