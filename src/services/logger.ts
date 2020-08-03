import { Service } from 'typedi'

@Service()
class Logger {
    info(message: string) {
        if (process.env.NODE_ENV === 'dev') {
            console.log(this.formatMessage(message));
        }
    }

    error(message: string) {
        console.log(`[!!ERROR!!]: `+this.formatMessage(message))
    }

    private formatMessage(message: string) {
        const date = new Date();
        return `[${date.toUTCString()}]: ${message}`;
    }
}

export default Logger;