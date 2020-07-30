import { Server, Socket } from "socket.io";
import { Container } from 'typedi';
import AuthService from './../services/auth'
import admin from "./userspaces/admin";

export default async(io: Server) => {

    //Connection handler
    io.on("connection", (socket) => {
        let user = { name: "", token: "", isAdmin: false, authorized: false };

        socket.on('auth', function(data) {
            let authService = Container.get(AuthService);
            let foundUser = authService.getUser(data.token);
            if (foundUser != null) {
                user.name = foundUser.name;
                user.isAdmin = foundUser.isAdmin;
                user.authorized = true;
                user.token = data.token;

                //Register events
                routeUser(socket, user, io);
            }
        })

        setTimeout(function () {
            //If user has not authenticated within 5 seconds of connection, kick them out.
            if (!user.authorized) {
                socket.disconnect(true);
            }
        }, 5000)
    })

    //Register events
    function routeUser(socket: Socket, user: any, io: Server) {
        if (user.isAdmin) {
            admin(socket, user, io);
            return;
        }
        user(socket, user, io);
    }
}