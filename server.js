const express = require('express');
const path = require('path');
const http = require('http');
const sockeio = require('socket.io');
const moment = require('moment');
const formatMessages = require('./utls/messages')
const {userJoin,getUser,getRoomUsers,userLeave} = require('./utls/users')

const app = express();
const server = http.createServer(app)

const io = sockeio(server);
io.on("connection", socket =>{
    //create a room for the connected client
    socket.on('joinRoom', ({username,room})=>{
        const user = userJoin(socket.id, username, room);  
        socket.join(user.room);
        //on connection
        io.to(user.room).emit('firstMessage', formatMessages(user.username,' has joined the chat !'));    
        //emit the join event
        io.to(user.room).emit('RoomData',{
            RoomUsers: getRoomUsers(room),
            room
        })
    })
    //client emit a message
    socket.on('chat-msg',(msg)=>{
        const user = getUser(socket.id);
        io.to(user.room).emit('broadcast',formatMessages(user.username,msg));
    })

    //client disconnect
    socket.on('disconnect',() =>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('lastMessage',formatMessages(user.username,'a user has lift the chat'));
        }
        
    })
})

app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));


app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/chat',(req,res)=>{
    
})

server.listen('3500',()=>{
    console.log('server is listning in port 3500')
})

