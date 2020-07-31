import { Service, Container } from 'typedi';
import Writer from '../resources/writer';
import { Socket, Server } from 'socket.io';

//Writer service
//Todo: save some memory by actually deleting disabled writers after some time.

@Service()
export default class WriterService {
    
    private writers: Writer[];
    private writerCount: number;

    constructor() {
        this.writers = [];
        this.writerCount = 0;
    }

    createWriter(name: string, socket: Socket) {
        let writer = new Writer(name, socket);
        this.writers.push(writer);
        this.writerCount++;
        return writer.getId();
    }

    findWriter(id: string): Writer | null {
        for (let i=0; i<this.writers.length; i++) {
            let writer = this.writers[i];
            if (writer.getId() === id) {
                return this.writers[i];
            }
        }
        return null;
    }

    deleteWriter(id: string) {
        for (let i=0; i<this.writers.length; i++) {
            let writer = this.writers[i];
            if (writer.getId() === id) {
                this.writers[i].disable();
                this.writerCount--;
                return;
            }
        }
    }

    sendStatus() {
        const io: Server = Container.get('socket-server');
        io.emit('status', {userCount: this.writerCount});
    }

    //Send all active writers to socket (used for filling data for new clients)
    sendAll(socket: Socket) {
        for (let i=0; i<this.writers.length; i++) {
            this.writers[i].sendUpdate(socket);
        }
    }
}