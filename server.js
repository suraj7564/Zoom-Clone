const express = require('express');
const app = express();
const server = require('http').Server(app);
const { v4: uuidv4} = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server ,{
    debug:true
});
const io = require('socket.io')(server);
app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/peerjs',peerServer);

app.get('/',(req,res) => {
    const roomId = uuidv4();
    res.redirect(`/${roomId}`);
});

app.get('/:room',(req,res) => {
    console.log('Joining....  Wait:)');
    res.render('room',{roomId: req.params.room});
});

io.on('connection',socket => {
    socket.on('join-room', (roomId, userId)=> {
        console.log("joined Room");
        socket.join(roomId);
        //socket.broadcast.to(roomId).emit('user-connected',userId);
        //socket.to(roomId).emit('user-connected', userId);
        //socket.emit('user-connected');
        io.to(roomId).emit('user-connected',userId);
    });
}); 


// app.listen(3000,(req,res) => {
//     console.log('App is Listening at post 3000');
// });
server.listen(3000);