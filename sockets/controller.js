


const socketController = (socket) => {
    
    console.log('Cliente conectado', socket.id );

    socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id );
    });

    socket.on('loadFiles', ( payload ) => {
        
        console.log(payload)
        socket.broadcast.emit('loadFiles', payload );

    })

}



module.exports = {
    socketController
}

