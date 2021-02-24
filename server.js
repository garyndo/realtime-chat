const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)  

//set static folder
app.use(express.static(path.join(__dirname,'public')))

const botName = 'Bot'

// Run when client connects 
io.on('connection', socket => {
    socket.on('joinroom',({username, room})=>{
        const user = userJoin(socket.id, username, room)

        socket.join(user.room)
        //welcome current user
    socket.emit('message', formatMessage(botName, 'welcome to chatcord!'))
    
        //broadcast when a user connects
    socket.broadcast
    .to(user.room)
    .emit(
        'message', 
        formatMessage(botName, `${user.username} has joined the room cht`))
    })

    //runs when client disconnect
    socket.on('disconnect', ()=>{
        io.emit('message', formatMessage(botName, 'a user has left the chat'))
    })
    //listen for chat message
    socket.on('chatMessage', msg =>{
        const user = getCurrentUser(socket.id)

        // console.log(msg) 
        io.to(user.room)
        .emit('message', formatMessage(user.username, msg))
    })
})

const PORT = 1600 || process.env.PORT

server.listen(PORT, ()=> console.log(`server running on ${PORT} `)) 