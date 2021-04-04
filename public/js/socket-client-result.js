const socket = io();

// Ref HTML
document.getElementById("genWik").style.display = "none";

socket.on('connect', () => {
    console.log('Conectado');
    socket.emit('loadResult');
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
});

socket.on('resultReady', () => {
    console.log('Resultado listo');
    document.getElementById("genWik").style.display = "flex";
    document.getElementById("genAnimation").style.display = "none";
});
