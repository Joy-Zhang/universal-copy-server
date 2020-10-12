const EventEmitter = require('events');

const MAX_LENGTH = 10

class Clipboard extends EventEmitter {

    constructor() {
        super();
        this.clipboard = [];
    }

    copy(content) {
        this.clipboard.unshift(content)
        if (this.clipboard.length > MAX_LENGTH) {
            this.clipboard.pop()
        }

        this.emit("copy", content)
    }

    all() {
        return this.clipboard;
    }
}

module.exports = new Clipboard()