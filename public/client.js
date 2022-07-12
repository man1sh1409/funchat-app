
const form=document.getElementById('send-container');
const messageInput=document.getElementById('msgInp');
const messageContainer=document.querySelector('.container');
const secretKey='A\cm73=]N$m3;7C)+'

const audio=new Audio('msgSound.mp3')

const append=(message,position) =>{
     const messageElement=document.createElement('div');
     messageElement.innerText=message
     messageElement.classList.add('message');
     messageElement.classList.add(position);
     messageContainer.append(messageElement);
     if(position=='left'){
       audio.play();
     }
}

form.addEventListener('submit',(e)=>{
     e.preventDefault();
     const message=messageInput.value;
     let ciphertext=CryptoJS.AES.encrypt(message,secretKey).toString();
     console.log(ciphertext);
     append(`You: ${message}`,'right');
     socket.emit('send',ciphertext);
     messageInput.value= '';
     
})

const username=prompt('Enter your name to join');
socket.emit('new-user-joined',username);

socket.on('user-joined',username =>{
  const a1= new Audio('newComerSound.mp3');
  append(`${username}: joined the chat`,'right')
  a1.play();
})
socket.on('recieve',(data)=>{
  let string=data.message;
  let bites=CryptoJS.AES.decrypt(string,secretKey);
  let message=bites.toString(CryptoJS.enc.Utf8);
  //console.log(message);
  append(`${data.name}: ${message}`,'left')
})
socket.on('left',name=>{
  append(`${name} left the chat`,'left');
})