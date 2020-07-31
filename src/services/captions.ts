import { Service, Container } from 'typedi';
import Caption from '../resources/caption';

@Service()
export default class CaptionService {
    
    private captions: Caption[];

    constructor() {
        this.captions = [];
    }

    createCaption(caption: string, speakerId: string, writerId: string) {
        let newCaption = new Caption(speakerId, writerId, caption)
        this.captions.push(newCaption);
        return newCaption.getId()
    }

    findCaption(id: string): Caption | null {
        for (let i=0; i<this.captions.length; i++) {
            let caption = this.captions[i];
            if (caption.getId() === id) {
                return this.captions[i];
            }
        }
        return null;
    }

    deleteCaption(id: string) {
        for (let i=0; i<this.captions.length; i++) {
            let caption = this.captions[i];
            if (caption.getId() === id) {
                this.captions[i].disable();
                return;
            }
        }
    }
}