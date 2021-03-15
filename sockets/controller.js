const { getCarnetData } = require('./design-patterns')
const colors = require('colors')
const { resetDir } = require("./file-system");
const { readUIElements, createUIElements, writeFileGUI, readFileGUi, writeConfigFile } = require("./file-system");
const dir = process.env.CONFIG_PATH;
const hbsDir = process.env.HBS_PATH;

let GUI_DATA;


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
        readUIElements(socket)
    })

    socket.on('genUi', ( payload ) => {
        createUIElements(socket,payload)
        writeFileGUI(payload);
    })

    socket.on('guiRun', ( payload ) => {
        let data = readFileGUi()
        socket.emit('gui-run', data)
    })

    socket.on('params', (payload) => {
        writeConfigFile(payload)
    })

}

module.exports = {
    socketController
}

