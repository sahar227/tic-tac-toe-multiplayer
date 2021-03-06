const GameRoom = require('./GameRoom');
const port = process.env.PORT || 3000;
const io = require('socket.io')(port, {cors: {
    origin: '*',
    methods: ["GET", "POST"],
    allowedHeaders: ["content-type"]
}})

const gameRooms = [];

io.on('connection', client => { 
    // Handles request to create a new room
    client.on('createRoom', ({roomName, password = ''}) => {
        const room = new GameRoom(client, roomName, password)
        gameRooms.push(room);
    });

    // Handles request for available rooms the user can join. roomNamePrefix allows users to filter for specific room.
    client.on('getAvailableRooms', (roomNamePrefix = '') => {
        const rooms = gameRooms.filter(gr => gr.isOpenForJoin() && gr.roomName.startsWith(roomNamePrefix)).map(gr =>gr.getRoomDTO());
        client.emit('availableRooms', rooms);
    });

    // Handles request to join specific room
    client.on('joinRoom', ({roomId, password=''}) => {
        const gameRoom = gameRooms.find(gr => gr.roomId === roomId && gr.isOpenForJoin());
        if(gameRoom)
            gameRoom.joinRoom(client, password);
        else
            client.emit('error', 'Room not found')
    });
 });
