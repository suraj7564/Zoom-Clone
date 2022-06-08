const socket = io('/');

const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');

myVideo.muted = true;
//var peer = new Peer();
var peer = new Peer(undefined,{
    path: '/peerjs',
    host: '/',
    port: '3000'
});

let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo,stream);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            console.log('video adding....');
            addVideoStream(video,userVideoStream);
        });
    });

    socket.on('user-connected',(userId)=>{
        connectToNewUser(userId, stream);
    })
})


peer.on('open',id => {
    socket.emit('join-room', ROOM_ID, id);
});


const connectToNewUser = (userId, stream) => {
    console.log('new user->',userId);
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    console.log("adding user...Before");
    call.on('stream', userVideoStream => {
        console.log("adding user...");
        addVideoStream(video,userVideoStream);
    });
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata' ,() => {
        video.play();
    });
    videoGrid.append(video);
}