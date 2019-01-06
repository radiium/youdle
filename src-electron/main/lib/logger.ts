export default class Logger {

    constructor() {}

    public log(msg, ...args) {
        msg = '[' + this.getName() + '] ' + msg;
        this.emitLog('log', msg, ...args);
    }
    public error(msg, ...args) {
        msg = '[ERROR][' + this.getName() + '] ' + msg;
        this.emitLog('error', msg, ...args);
    }

    private emitLog(level, msg, ...args) {
        console[level](msg);
        if (args.length > 0) {
            console.dir(args);
        }
    }

    private getName() {
        // return this.toString().match(/ (\w+)/)[1];
        return this.constructor.name;
    }
}
