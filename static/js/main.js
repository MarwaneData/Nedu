


var usernameInput = document.querySelector('#username');
var btnJoin = document.querySelector('#btn-join');
var joining = document.querySelector('#joining');
var mapPeers = {};
var username;
var webSocket;

function webSocketOnMessage(event){
    var  parsedData = JSON.parse(event.data);
    var peerUsername = parsedData[ 'peer']; 
    var action = parsedData[ 'action']; 

    if(username==peerUsername){
        return;
    }
    var receiver_channel_name = parsedData['message']['receiver_channel_name'];
    if(action == 'new-peer'){
        createdOffer(peerUsername, receiver_channel_name);

        return;
    }
    if(action == 'new-offer'){
        var offer = parsedData['message']['sdp'];

        createAnswer(offer, peerUsername, receiver_channel_name);

        return;
    }
    if(action == 'new-answer'){
        var answer = parsedData['message']['sdp'];
        var peer = mapPeers[peerUsername][0];

        peer.setRemoteDescription(answer);

        return
    }
}

btnJoin.addEventListener('click', ()=>{
    username = usernameInput.value;

    if(username==''){
        return;
    }
    usernameInput.value = '';
    joining.classList += ' none' ;
    usernameInput.disabled = true;
    
    usernameInput.getElementsByClassName.visibility = 'hidden';
    btnJoin.disabled = true;
    btnJoin.getElementsByClassName.visibility = 'hidden';

    var labelUsername = document.querySelector('#label-username');
    
    labelUsername.innerHTML = username;


    var loc = window.location;
    var wsStart = 'ws://';

    if(loc.protocol=='https:'){
         wsStart = 'wss://';

    }
    var  endPoint = wsStart + loc.host + loc.pathname;

    webSocket = new WebSocket(endPoint);

    webSocket.addEventListener('open', (e) =>{
        console.log('opened');

        sendSignal('new-peer', {});
    });
    webSocket.addEventListener('close', (e) =>{
        console.log('closed');

    });
    webSocket.addEventListener('message', webSocketOnMessage);
    webSocket.addEventListener('error', (e) =>{
        console.log('error');

    } );
});

var localStream = new MediaStream();

const constraints = {
    'video':true,
    'audio':true
};

const localVideo = document.querySelector('#local-video');
const btnToggleAudio = document.querySelector('#btn-toggle-audio');
const btnToggleVedio = document.querySelector('#btn-toggle-video');

var userMedia = navigator.mediaDevices.getUserMedia(constraints)
    .then(stream =>{
        localStream = stream;
        localVideo.srcObject = localStream;
        localVideo.muted = true;


        var audioTracks =  stream.getAudioTracks();
        var videoTracks =  stream.getVideoTracks();

        audioTracks[0].enabled = true;
        videoTracks[0].enabled = true;

        btnToggleAudio.addEventListener('click', ()=>{
            audioTracks[0].enabled = !audioTracks[0].enabled;
            if(audioTracks[0].enabled){
                btnToggleAudio.innerHTML = 'Audio Mute';

                return;
            }
            btnToggleAudio.innerHTML = 'Audio Unmute';
        });

        btnToggleVedio.addEventListener('click', ()=>{
            videoTracks[0].enabled = !videoTracks[0].enabled;
            if(videoTracks[0].enabled){
                btnToggleVedio.innerHTML = 'Video off';

                return;
            }
            btnToggleVedio.innerHTML = 'Video On';
        });
    })
    .catch(error => {
        console.log('eror media');
    });
    var btnSendMsg = document.querySelector('#btn-send-msg');
    var messageList = document.querySelector('#message-list');
    var messageInput = document.querySelector('#msg');

    btnSendMsg.addEventListener('click', senMsgOnClick)

    function senMsgOnClick(){
        var message = messageInput.value
        var li = document.createElement('li');
        li.appendChild(document.createTextNode('Me : '+ message));
        messageList.appendChild(li);

        var datachannels = getDataChannels();
        message = username + ': ' + message ;

        for(index in datachannels){
            datachannels[index].send(message);
       }
        messageInput.value = '';
    }
    

function sendSignal(action,message ){
    var jsonStr = JSON.stringify({
        'peer': username,
        'action':action,
        'message': message,
    });
    webSocket.send(jsonStr);
}

function createdOffer(peerUsername, receiver_channel_name) {

    var peer = new RTCPeerConnection(null);
    addLocalTracks(peer);

    var dc = peer.createDataChannel('channel')
    dc.addEventListener('open', () =>{
        console.log('opeeeeened');
    });

    dc.addEventListener('message', dcOnMessage);

    var remoteVideo =  createVideo(peerUsername)

    setOntrack(peer, remoteVideo);

    mapPeers[peerUsername] = [peer, dc];

    peer.addEventListener('iceconnectionstatechange', ()=>{
        var iceconnectionstate = peer.iceConnectionState;

        if(iceconnectionstate==='failed' || iceconnectionstate==='disconnected' || iceconnectionstate==='closed'){
            delete mapPeers[peerUsername];
            if(iceconnectionstate!='closed'){
                peer.close();
            }
            removeVideo(remoteVideo);
        }
    });
    peer.addEventListener('icecandidate', (event) =>{
        if(event.candidate){
            console.log('new Ice candidate:', JSON.stringify(peer.localDescription));

            return;
        }

        sendSignal('new-offer',{
            'sdp': peer.localDescription,
            'receiver_channel_name': receiver_channel_name,

        });
    });

    peer.createOffer()
        .then(o => peer.setLocalDescription(o))
        .then(()=>{
            console.log('Local description set succes');
        })
}

function createAnswer(offer, peerUsername, receiver_channel_name) {
    var peer = new RTCPeerConnection(null);
    addLocalTracks(peer);
    var remoteVideo =  createVideo(peerUsername)
    setOntrack(peer, remoteVideo);
    peer.addEventListener('datachannel', e =>{
        peer.dc = e.channel ;
        peer.dc.addEventListener('open', () =>{
            console.log('opeeeeened');
        });
        peer.dc.addEventListener('message', dcOnMessage);

        mapPeers[peerUsername] = [peer, peer.dc];
        
    })

    peer.addEventListener('iceconnectionstatechange', () =>{
        var iceconnectionstate = peer.iceConnectionState;

        if(iceconnectionstate==='failed' || iceconnectionstate==='disconnected' || iceconnectionstate==='closed'){
            delete mapPeers[peerUsername];
            if(iceconnectionstate != 'closed'){
                peer.close();
            }
            removeVideo(remoteVideo);
        }
    });


    peer.addEventListener('icecandidate', (event) =>{
        if(event.candidate){
            console.log('new Ice candidate:', JSON.stringify(peer.localDescription));

            return;
        }

        sendSignal('new-answer',{
            'sdp': peer.localDescription,
            'receiver_channel_name': receiver_channel_name

        });
    });
    
    peer.setRemoteDescription(offer)
        .then(()=>{
            console.log('remote description set successfully for %s.', peerUsername);
            return peer.createAnswer();
        })
        .then(a =>{
            console.log('answer created ');
            peer.setLocalDescription(a);
        })
}


function addLocalTracks(peer) {
    localStream.getTracks().forEach(track => {
        peer.addTrack(track, localStream);
    });
    
    return;
}
messageList = document.querySelector('#message-list');
function dcOnMessage(event) {
    var message = event.data;
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(message));
    messageList.appendChild(li);
}

function createVideo(peerUsername) {
    var videoContainer = document.querySelector('#video-container');
    var remoteVideo = document.createElement('video');

    remoteVideo.id = peerUsername + '-video';
    remoteVideo.autoplay = true;
    remoteVideo.playsInline = true;

    var videoWrapper = document.createElement('div');
    videoContainer.appendChild(videoWrapper);
    videoWrapper.appendChild(remoteVideo);

    return remoteVideo;
}

function setOntrack(peer, remoteVideo) {
    var remoteStream = new MediaStream();

    remoteVideo.srcObject = remoteStream;

    peer.addEventListener('track', async (event) =>{
        remoteStream.addTrack(event.track, remoteStream);
    })



}


function removeVideo(video) {
    var videoWrapper = video.parentNode;
    videoWrapper.parentNode.removeChild(videoWrapper);
}


function getDataChannels(){
    var dataChannels = [];

    for (peerUsername in mapPeers){
      var datachannel = mapPeers[peerUsername][1];

      dataChannels.push(datachannel);
    }
    return dataChannels;
}
