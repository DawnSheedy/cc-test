import { Service } from 'typedi';

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
    //TODO: maybe hash tokens with a secret, use a real datastore, etc.
    getUser(token: string):null | User {
        let user = users[token];
        if (user) {
            return user;
        }
        return null;
    }
}