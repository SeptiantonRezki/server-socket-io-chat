"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    constructor(value) {
        this.user = value.user;
        this.idMessage = value.idMessage;
        this.textMessage = value.textMessage;
    }
}
exports.default = Message;
