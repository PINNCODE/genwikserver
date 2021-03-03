const { getCarnetData } = require('./design-patterns')
const colors = require('colors')


const socketController = (socket) => {
    
    console.log(`Cliente conectado \nsocket id:`.brightGreen, colors.brightGreen(socket.id) );

    socket.on('disconnect', () => {
        console.log('Cliente desconectado \nsocket id:'.brightRed,  colors.brightRed(socket.id) );
    });

    socket.on('loadFiles', ( payload ) => {
        getCarnetData(payload);
    })

}

module.exports = {
    socketController
}

