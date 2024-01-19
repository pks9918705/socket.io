import { io } from "socket.io-client";
import { useEffect, useMemo, useState } from "react";
import { Button, Container, TextField, Typography } from '@mui/material';
import './App.css'

function App() {
  const [message, setMessage] = useState("");
  const [socketId, setSocketId] = useState("");
  const [commingMsg, setCommingMsg] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [joinRoom, setJoinRoom] = useState(""); // New state for joining a room
  const [sendMsg,setSendMsg] = useState([]);

  const socket = useMemo(() => io("http://localhost:3000/"), []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room: roomName,socketId });
    setMessage("");
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    socket.emit("join-room", joinRoom);
    setRoomName(joinRoom);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("This is Your ID ", socket.id);
      setSocketId(socket.id);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    socket.on("recieve-message", (data) => {
      console.log(data);
      if(data.socketId === socket.id){
        setSendMsg((sendMsg)=>[...sendMsg,data.message])
      }else{
        setCommingMsg((commingMsg) => [...commingMsg, data.message]);

      }
      
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" component="div" gutterBottom>
        {socketId}
      </Typography>
   <div className="chat-section">
   <Typography variant="h6">
        <h2>Comming</h2>
        <ul>
          {commingMsg.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </Typography>
      <Typography variant="h6">
        <h2>Sending</h2>
        <ul>
          {sendMsg.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </Typography>

   </div>
      

      <form onSubmit={handleSendMessage}>
        <TextField
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
        />
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      <form onSubmit={handleJoinRoom}>
        <TextField
          value={joinRoom}
          onChange={(e) => setJoinRoom(e.target.value)}
          id="outlined-basic"
          label="Join Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join Room
        </Button>
      </form>
    </Container>
  );
}

export default App;
