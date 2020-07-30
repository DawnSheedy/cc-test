import { Socket, Server } from "socket.io";

export default async (socket: Socket, user: any, io: Server) => {
    socket.on('claim-speaker', (data) => {

    })

    socket.on('new-caption', (data) => {
        
    })

    socket.on('release', (data) => {
        
    })
}