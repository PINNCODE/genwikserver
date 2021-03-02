const { getCarnetData } = require('./design-patterns')


const socketController = (socket) => {
    
    console.log('Cliente conectado', socket.id );

    socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id );
    });

    socket.on('loadFiles', ( payload ) => {
        getCarnetData(payload);
    })

}



module.exports = {
    socketController
}

