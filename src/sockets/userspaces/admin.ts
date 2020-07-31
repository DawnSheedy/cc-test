import { Socket, Server } from "socket.io";
import { Container } from 'typedi';
import WriterService from "../../services/writers";
import SpeakerService from "../../services/speakers";
import CaptionService from "../../services/captions";

export default async (socket: Socket, user: any, io: Server) => {
    const writerService = Container.get(WriterService);
    const speakerService = Container.get(SpeakerService);
    const captionService = Container.get(CaptionService);

    speakerService.sendAll(socket);
    writerService.sendAll(socket);

    socket.on('new-speaker', (data) => {
        speakerService.createSpeaker(data.name);
    })

    socket.on('delete-speaker', (data) => {
        speakerService.deleteSpeaker(data.speakerId);
    })

    socket.on('kill-writer', (data) => {
        writerService.deleteWriter(data.writerId);
    })

    socket.on('release-captioner', (data) => {
        speakerService.releaseSpeaker(data.speakerId);
    })

    socket.on('delete-caption', (data) => {
        captionService.deleteCaption(data.captionId);
    })
}