   const socket = io();
   
   const  form = document.getElementById('chat-form');
   const chatMessages = document.querySelector('.chat-messages');
   //get params from url 
   const urlParams = new URLSearchParams(window.location.search);
   const username = urlParams.get('username');
   const room = urlParams.get('room');
   //join to the room
   socket.emit('joinRoom',{username, room});
   
form.addEventListener('submit', (e) =>{
   e.preventDefault();
   
   const msg = e.target.elements.msg.value;
      socket.emit('chat-msg', msg);
   e.target.elements.msg.value ="";
   e.target.elements.msg.focus();
})
socket.on('RoomData', ({RoomUsers, room}) =>{
   displayRoomData(room,RoomUsers)
})
socket.on('firstMessage', (msg) =>{
   outPutMessage(msg)
  
} )

socket.on('broadcast', (msg) =>{
   outPutMessage(msg);
} )

socket.on('lastMessage', (msg) =>{
   outPutMessage(msg);
} )

function outPutMessage(msg){
   const msgElement = document.createElement('div');
   msgElement.classList.add('message');
   msgElement.innerHTML = `<p class="meta">${msg.username} <span>${msg.date}</span></p>
   <p class="text">
      ${msg.msg}
   </p>`;
   document.querySelector('.chat-messages').appendChild(msgElement);
   chatMessages.scrollTop = chatMessages.scrollHeight;
}

function displayRoomData(Room,usersRoom){
   console.log(usersRoom)
   document.getElementById('room-name').innerText = Room;
   document.getElementById('users').innerHTML =`
      ${usersRoom.map(user => `<li>${user.username}</li>`).join('')}
   `   
}
