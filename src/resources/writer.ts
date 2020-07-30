class Writer {
    private name: string;
    private key: string;
    private claimedBy: string;
    private available: boolean;

    constructor(name: string, key) {
        this.name = name;
        this.claimedBy = "";
        this.input = "";
        this.available = false;
    }

    claim(writer: string) {
        this.claimedBy = writer;
    }
}

export default Writer;