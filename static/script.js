
const socket = io('http://localhost:3000/chat')
const roomSocket = io('http://localhost:3000/room')

socket.on('connect', () => {
    console.log('connected')
})



