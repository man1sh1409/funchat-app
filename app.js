const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const CryptoJS = require("crypto-js");
const secretKey='A\cm73=]N$m3;7C)+';
const port=process.env.PORT||5000
app.use(express.static("public"));

const users={}

io.on('connection', (socket) => {
    socket.on('new-user-joined',name=>{
       //console.log('new user',name); 
       users[socket.id]=name;
       socket.broadcast.emit('user-joined',name);
    });
    socket.on('send',ciphertext=>{
        //console.log(ciphertext);
        let msg=CryptoJS.AES.decrypt(ciphertext,secretKey);
        let mess=msg.toString(CryptoJS.enc.Utf8)
        //console.log(mess);
        //let ciphername=CryptoJS.AES.encrypt(users[socket.id],secretKey).toString();
        let data={
            name:users[socket.id],
            message:ciphertext
        }
        socket.broadcast.emit('recieve',data);
    });
    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    })
});



server.listen(port, () => {
  console.log('listening on *:'+port);
});