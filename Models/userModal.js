"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(value) {
        this.idUser = value.idUser;
        this.idSocket = value.idSocket;
        this.name = value.name;
        this.username = value.username;
        this.password = value.password;
        this.imageUrl = value.imageUrl;
        this.statusOnline = value.statusOnline;
    }
}
exports.default = User;
