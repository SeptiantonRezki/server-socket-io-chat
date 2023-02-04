"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const userModal_1 = __importDefault(require("./Models/userModal"));
const groupModal_1 = __importDefault(require("./Models/groupModal"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, { /* options */});
app.use((0, cors_1.default)({ credentials: true, origin: true }));
const clients = [];
const groups = [];
io.on("connection", (socket) => {
    socket.on('storeClientInfo', function (data) {
        let conditionAddClient = true;
        if (clients.length > 0) {
            clients.forEach((element1) => {
                if (element1.idUser === data.idUser) {
                    conditionAddClient = false;
                }
            });
        }
        if (conditionAddClient === true) {
            var clientInfo = new userModal_1.default({ idSocket: socket.id, idUser: data.idUser, name: data.name, password: data.password, username: data.username, imageUrl: data.imageUrl, statusOnline: true });
            clients.push(clientInfo);
            io.sockets.emit('online user', clients);
            // socket.broadcast.emit('online user', clients)
        }
        else {
            clients.forEach((element1) => {
                if (element1.idUser === data.idUser) {
                    element1.idSocket = socket.id;
                    element1.statusOnline = true;
                }
            });
            io.sockets.emit('online user', clients);
        }
    });
    socket.on('disconnect', function (data) {
        for (var i = 0, len = clients.length; i < len; ++i) {
            var c = clients[i];
            if (c.idSocket == socket.id) {
                // clients.splice(i, 1);
                c.statusOnline = false;
                io.sockets.emit('online user', clients);
                // socket.broadcast.emit('online user', clients)
                break;
            }
        }
    });
    socket.on("private message", (value) => {
        if (groups.length > 0) {
            let conditionGroupIsCreated = false;
            groups.forEach((element1) => {
                if (value.clientA.idUser === element1.idClientA && value.clientB.idUser === element1.idClientB) {
                    conditionGroupIsCreated = true;
                }
                else if (value.clientA.idUser === element1.idClientB && value.clientB.idUser === element1.idClientA) {
                    conditionGroupIsCreated = true;
                }
            });
            if (conditionGroupIsCreated === false) {
                groups.push(new groupModal_1.default({ id: Date.now().toString(), messages: [], idClientA: value.clientA.idUser, idClientB: value.clientB.idUser }));
            }
            else {
            }
        }
        else {
            groups.push(new groupModal_1.default({ id: Date.now().toString(), messages: [], idClientA: value.clientA.idUser, idClientB: value.clientB.idUser }));
        }
        // 
        let selectedGroup = null;
        groups.forEach((element1) => {
            if (value.clientA.idUser === element1.idClientA && value.clientB.idUser === element1.idClientB) {
                element1.messages.push(value.message);
                selectedGroup = element1;
            }
            else if (value.clientA.idUser === element1.idClientB && value.clientB.idUser === element1.idClientA) {
                element1.messages.push(value.message);
                selectedGroup = element1;
            }
        });
        io.to(value.clientB.idSocket).emit('private message', selectedGroup);
    });
    io.sockets.emit('online user', clients);
    socket.on('messageClientSelected', (value) => {
        if (groups.length > 0) {
            let conditionGroupIsCreated = false;
            groups.forEach((element1) => {
                if (value.clientA.idUser === element1.idClientA && value.clientB.idUser === element1.idClientB) {
                    conditionGroupIsCreated = true;
                }
                else if (value.clientA.idUser === element1.idClientB && value.clientB.idUser === element1.idClientA) {
                    conditionGroupIsCreated = true;
                }
            });
            if (conditionGroupIsCreated === false) {
                groups.push(new groupModal_1.default({ id: Date.now().toString(), messages: [], idClientA: value.clientA.idUser, idClientB: value.clientB.idUser }));
            }
            else {
            }
        }
        else {
            groups.push(new groupModal_1.default({ id: Date.now().toString(), messages: [], idClientA: value.clientA.idUser, idClientB: value.clientB.idUser }));
        }
        // 
        let selectedGroup = null;
        groups.forEach((element1) => {
            if (value.clientA.idUser === element1.idClientA && value.clientB.idUser === element1.idClientB) {
                selectedGroup = element1;
            }
            else if (value.clientA.idUser === element1.idClientB && value.clientB.idUser === element1.idClientA) {
                selectedGroup = element1;
            }
        });
        io.to(value.clientA.idSocket).emit('private message', selectedGroup);
        io.to(value.clientB.idSocket).emit('private message', selectedGroup);
    });
    // socket.broadcast.emit('online user', clients)
});
httpServer.listen(5000, () => {
    console.log('server running in port 5000');
});
