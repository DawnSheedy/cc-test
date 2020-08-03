import { Service, Container } from 'typedi';
import Caption from '../resources/caption';
import Logger from './logger';
const logger = Container.get(Logger);

//Caption service
//TODO: save some memory by actually deleting sent captions after some time

@Service()
export default class CaptionService {
    
    private captions: Caption[];

    constructor() {
        this.captions = [];
        logger.info("Caption service started.")
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