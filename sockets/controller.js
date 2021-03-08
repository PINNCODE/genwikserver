const { getCarnetData } = require('./design-patterns')
const colors = require('colors')
const { resetDir } = require("./file-system");
const { createUIElements } = require("./file-system");
const dir = process.env.CONFIG_PATH;
const hbsDir = process.env.HBS_PATH;


const socketController = (socket) => {
    
    console.log(`Cliente conectado \nsocket id:`.brightGreen, colors.brightGreen(socket.id) );

    socket.on('disconnect', () => {
        console.log('Cliente desconectado \nsocket id:'.brightRed,  colors.brightRed(socket.id) );
    });

    socket.on('loadFiles', ( payload ) => {
        resetDir(dir).then(
            () => resetDir(`${hbsDir}/partials`).then( () => getCarnetData(payload , socket))
        )
    })

    socket.on('showInputs', ( payload ) => {
        createUIElements(socket)
        console.log('showInputs')

    })

}

module.exports = {
    socketController
}

