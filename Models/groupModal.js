"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Group {
    constructor(value) {
        this.id = value.id;
        this.idClientA = value.idClientA;
        this.idClientB = value.idClientB;
        this.messages = value.messages;
    }
}
exports.default = Group;
