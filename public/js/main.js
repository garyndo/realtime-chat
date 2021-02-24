//akses form dari html untuk input value
const chatform = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')

//get username and room from URL
const { username, room } = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})

const socket = io()

//join chat room 
socket.emit('joinRoom',{ username, room })

//message from server
socket.on('message', message =>{
    console.log(message)
    outputMessage(message)
    //scroll down=> otomatis menampilkan chat paling bawaha atau paling baru yg d masukan
    chatMessages.scrollTop = chatMessages.scrollHeight
})

//message submit
chatform.addEventListener('submit', (e)=>{
    e.preventDefault();
    //get message text
    const msg = e.target.elements.msg.value
    // emit message to srver
    // console.log(msg)
    socket.emit('chatMessage',msg)
    // clear inputs => kosongkan input setelah enter chat
    e.target.elements.msg.value=''
    e.target.elements.msg.focus()
})

//output message to DOM
function outputMessage(message){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
                        <p class="text">
                            ${message.text}
                        </p>`
    document.querySelector('.chat-messages').appendChild(div)
}