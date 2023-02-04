import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors';
import User from "./Models/userModal";
import Message from "./Models/messageModal";
import Group from "./Models/groupModal";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

app.use(cors({ credentials: true, origin: true }))

const clients: User[] = [];
const groups: Group[] = [];

// jadi setiap kali user kirim pesan maka disimpan dalam group dan data chat akan dikirmkan ke user

// dan client hanya memeperbarui data id message terbaru saja


// kalau client mengirim pesan memerlukan id socket yang terdaftar dan m

interface messagePrivateInterface {
  clientA: User,
  clientB: User,
  message: Message
}

io.on("connection", (socket) => {

  socket.on('storeClientInfo', function (data) {
    let conditionAddClient = true;
    if (clients.length > 0) {
      clients.forEach((element1) => {
        if (element1.idUser === data.idUser) {
          conditionAddClient = false;
        }
      })
    }
    if (conditionAddClient === true) {
      var clientInfo = new User({ idSocket: socket.id, idUser: data.idUser, name: data.name, password: data.password, username: data.username, imageUrl: data.imageUrl, statusOnline: true, lastOnline : Date.now().toString() });
      clients.push(clientInfo);
      io.sockets.emit('online user', clients);
      // socket.broadcast.emit('online user', clients)
    } else {
      clients.forEach((element1) => {
        if (element1.idUser === data.idUser) {
          element1.idSocket = socket.id;
          element1.statusOnline = true;
          element1.lastOnline = Date.now().toString()
        }
      })
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

  socket.on("private message", (value: messagePrivateInterface) => {
    if (groups.length > 0) {
      let conditionGroupIsCreated = false;
      groups.forEach((element1) => {
        if (value.clientA.idUser === element1.idClientA && value.clientB.idUser === element1.idClientB) {
          conditionGroupIsCreated = true;
        } else if (value.clientA.idUser === element1.idClientB && value.clientB.idUser === element1.idClientA) {
          conditionGroupIsCreated = true;
        }
      })
      if (conditionGroupIsCreated === false) {
        groups.push(new Group({ id: Date.now().toString(), messages: [], idClientA: value.clientA.idUser, idClientB: value.clientB.idUser }))

      } else {

      }
    } else {
      groups.push(new Group({ id: Date.now().toString(), messages: [], idClientA: value.clientA.idUser, idClientB: value.clientB.idUser }))
    }
    // 
    let selectedGroup : Group | null = null; 
    groups.forEach((element1) => {
      if (value.clientA.idUser === element1.idClientA && value.clientB.idUser === element1.idClientB) {
        element1.messages.push(value.message)
        selectedGroup = element1;
      } else if (value.clientA.idUser === element1.idClientB && value.clientB.idUser === element1.idClientA) {
        element1.messages.push(value.message)
        selectedGroup = element1;
      }
    })
    io.to(value.clientB.idSocket!).emit('private message', selectedGroup);
  });
  io.sockets.emit('online user', clients);

  socket.on('messageClientSelected', (value: messagePrivateInterface) => {
    if (groups.length > 0) {
      let conditionGroupIsCreated = false;
      groups.forEach((element1) => {
        if (value.clientA.idUser === element1.idClientA && value.clientB.idUser === element1.idClientB) {
          conditionGroupIsCreated = true;
        } else if (value.clientA.idUser === element1.idClientB && value.clientB.idUser === element1.idClientA) {
          conditionGroupIsCreated = true;
        }
      })
      if (conditionGroupIsCreated === false) {
        groups.push(new Group({ id: Date.now().toString(), messages: [], idClientA: value.clientA.idUser, idClientB: value.clientB.idUser }))

      } else {

      }
    } else {
      groups.push(new Group({ id: Date.now().toString(), messages: [], idClientA: value.clientA.idUser, idClientB: value.clientB.idUser }))
    }
    // 
    let selectedGroup : Group | null = null; 
    groups.forEach((element1) => {
      if (value.clientA.idUser === element1.idClientA && value.clientB.idUser === element1.idClientB) {
        selectedGroup = element1;
      } else if (value.clientA.idUser === element1.idClientB && value.clientB.idUser === element1.idClientA) {
        selectedGroup = element1;
      }
    })
    io.to(value.clientA.idSocket!).emit('messageClientSelected', selectedGroup);
    io.to(value.clientB.idSocket!).emit('messageClientSelected', selectedGroup);
  })

  // socket.broadcast.emit('online user', clients)
});

httpServer.listen(5000, () => {
  console.log('server running in port 5000')
});