
const socket = io();
let filesData;


socket.on('connect', () => {
    console.log('Conectado');
    socket.emit('guiRun');
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
});

socket.on('gui-run', (payload) => {
    filesData = payload;
})

const executeComponent = () => {
    console.log(filesData)
    filesData.forEach( data => {
        console.log(data)
        let params = data.elementosGraficos.entradas.map( inputs => {
            console.log(`${inputs.param}_${data.nombre}`)
            let valueInput = document.getElementById(`${inputs.param}_${data.nombre}`).value;
            console.log(valueInput);
            return `-${inputs.param} ${valueInput}`;
        })
        socket.emit('params', params);
        //document.querySelector('')
    })
}
