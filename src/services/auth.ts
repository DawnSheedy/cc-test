import { Service } from 'typedi';

//This has almost ZERO security.

interface User {
    name: string;
    isAdmin: boolean;
    active: boolean;
}

const users: Record<string, User> = {
    "7ahvhad7fbHBhabnbasdf7HCh": {
        name: "OBS Client",
        isAdmin: false,
        active: false
    },
    "tkasony": {
        name: "Taylor",
        isAdmin: false,
        active: false
    },
    "dawnshee": {
        name: "Dawn",
        isAdmin: false,
        active: false
    },
    "techdesk": {
        name: "Tech Desk",
        isAdmin: true,
        active: false
    },
    "techdesk2": {
        name: "Tech Desk 2",
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