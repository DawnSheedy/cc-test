import { Service } from 'typedi';

//This has almost ZERO security.

interface User {
    name: string;
    isAdmin: boolean;
    active: boolean;
}

const users: Record<string, User> = {
    "devuser": {
        name: "Dawn Sheedy",
        isAdmin: false,
        active: false
    },
    "devuser2": {
        name: "Dawn Sheedy2",
        isAdmin: false,
        active: false
    },
    "devuser3": {
        name: "Dawn Sheedy3",
        isAdmin: false,
        active: false
    },
    "devadmin": {
        name: "Dawn Sheedy [Admin]",
        isAdmin: true,
        active: false
    }
}

@Service()
export default class AuthService {
    getUser(token: string):null | User {
        if (users[token]) {
            if (users[token].active) {
                return null;
            }
            users[token].active = true;
            return users[token];
        }
        return null;
    }

    releaseUser(token: string) {
        if (users[token]) {
            users[token].active = false;
        }
    }
}