
const socket = io();
let filesData;
let params;
document.getElementById("genAnimation").style.display = "none";


socket.on('connect', () => {
    console.log('Conectado');
    socket.emit('guiRun');
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
});

socket.on('gui-run', (payload) => {
    console.log(payload)
    filesData = payload;
})

socket.on('component-exec', (payload) => {
    window.location.replace("http://localhost:8080/result");
})

const executeComponent = () => {
    document.getElementById("genAnimation").style.display = "flex";
    document.getElementById("genWik").style.display = "none";
    filesData.order.forEach( data => {
        let params = data.elementosGraficos.entradas.map( inputs => {
            let valueInput = document.getElementById(`${inputs.param}_${data.nombre}`).value;
            return `-${inputs.param} ${valueInput}`;
        })
        setTimeout(() => {
            socket.emit('params', params);
        }, 1000)
        //document.querySelector('')
    })
}
