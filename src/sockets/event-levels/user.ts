import { Socket, Server } from "socket.io";
import { Container } from 'typedi';
import WriterService from "../../services/writers";
import SpeakerService from "../../services/speakers";
import CaptionService from "../../services/captions";
import AuthService from "../../services/auth";
import Logger from "../../services/logger";

export default async (socket: Socket, user: any, io: Server) => {
    const writerService = Container.get(WriterService);
    const speakerService = Container.get(SpeakerService);
    const captionService = Container.get(CaptionService);
    const authService = Container.get(AuthService);
    const logger = Container.get(Logger);

    const writerId = writerService.createWriter(user.name, socket);

    user.writerId = writerId;

    logger.info(`User '${user.name}' has been assigned writer id: ${user.writerId}`);
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

    socket.on('delete-caption', (data) => {
        //Delete only if this user wrote it.
        let caption = captionService.findCaption(data.captionId);
        if (!caption) return;
        if (caption.getWriter()?.getId() === user.writerId) {
            captionService.deleteCaption(caption.getId());
        }
    })

    socket.on('release', (data) => {
        speakerService.releaseSpeaker(speakerId);
    })

    socket.on('disconnect', () => {
        speakerService.releaseSpeaker(speakerId);
        writerService.deleteWriter(writerId);
        authService.releaseUser(user.token);
        logger.info(`User '${user.name}' has disconnected. (socket id: ${socket.id})`)
    })
}