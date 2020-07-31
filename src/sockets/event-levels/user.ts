import { Socket, Server } from "socket.io";
import { Container } from 'typedi';
import WriterService from "../../services/writers";
import SpeakerService from "../../services/speakers";
import CaptionService from "../../services/captions";

export default async (socket: Socket, user: any, io: Server) => {

    const writerService = Container.get(WriterService);
    const speakerService = Container.get(SpeakerService);
    const captionService = Container.get(CaptionService);

    const writerId = writerService.createWriter(user.name, socket);

    user.writerId = writerId;
    //Send writer session id to client
    socket.emit('user-assignment', { user });

    let speakerId = '';

    speakerService.sendAll(socket);

    socket.on('claim-speaker', (data) => {
        if (speakerService.claimSpeaker(data.speakerId, writerId)) speakerId = data.speakerId;
    })

    socket.on('new-caption', (data) => {
        captionService.createCaption(data.caption, speakerId, writerId);
    })

    socket.on('release', (data) => {
        speakerService.releaseSpeaker(speakerId);
    })

    socket.on('disconnect', () => {
        speakerService.releaseSpeaker(speakerId);
        writerService.deleteWriter(writerId);
    })
}