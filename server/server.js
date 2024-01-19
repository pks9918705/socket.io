const express = require('express');
const { Server } = require('socket.io');
const { createServer } = require('http');
const cors = require('cors');

const port = 3000;
const app = express();

app.use(cors());

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log('user connected');
    console.log('Id', socket.id);
    socket.emit("welcome", "Welcome to the server");
    socket.broadcast.emit("welcome", `${socket.id} has joined the server`);

    socket.on("message", ({ message, room,socketId }) => {
        console.log({ message, room });

        // Join the socket to the specified room
        socket.join(room);

        // Emit the message to all sockets in the room
        io.to(room).emit("recieve-message",{ message,socketId});
    });

    socket.on("join-room", (room) => {
        // Join the socket to the specified room
        socket.join(room);
        console.log(`${socket.id} joined room: ${room}`);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(port, () => {
    console.log('listening on 3000');
});
