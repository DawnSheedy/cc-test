import { Server, Socket } from "socket.io";
import { Container } from 'typedi';
import AuthService from './../services/auth'
import adminEvents from "./event-levels/admin";
import userEvents from "./event-levels/user"

export default async(io: Server) => {

    //Connection handler
    io.on("connection", (socket) => {
        let user = { name: "", token: "", isAdmin: false, authorized: false };

        //Give users 2 seconds to authenticate before disconnecting them
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

        //Timeout for authorization
        setTimeout(function () {
            //If user has not authenticated within 5 seconds of connection, kick them out.
            if (!user.authorized) {
                socket.disconnect(true);
            }
        }, 2000)
    })

    //Register event listeners depending on authorization level
    function routeUser(socket: Socket, user: any, io: Server) {
        if (user.isAdmin) {
            adminEvents(socket, user, io);
            return;
        }
        userEvents(socket, user, io);
    }
}