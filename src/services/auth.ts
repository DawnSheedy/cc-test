import { Service } from 'typedi';

//This has almost ZERO security.

interface User {
    name: string;
    isAdmin: boolean;
}

const users: Record<string, User> = {
    "devuser": {
        name: "Dawn Sheedy",
        isAdmin: false
    },
    "devadmin": {
        name: "Dawn Sheedy [Admin]",
        isAdmin: true
    }
}

@Service()
export default class AuthService {
    getUser(token: string):null | User {
        let user = users[token];
        if (user) {
            return user;
        }
        return null;
    }
}