const socket = io();

// Ref HTML
document.getElementById("genWik").style.display = "none";
let paramsTable = document.getElementById("paramsTable");

socket.on('connect', () => {
    console.log('Conectado');
    socket.emit('loadResult');
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
});

socket.on('resultReady', (payload) => {
    console.log('Resultado listo');
    console.log(payload)

    payload.values.forEach(value => {
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let txt1 = document.createTextNode(value[0]);
        let txt2 = document.createTextNode(value[1]);

        td1.appendChild(txt1)
        td2.appendChild(txt2)

        tr.appendChild(td1);
        tr.appendChild(td2);

        document.getElementById("paramsTable").appendChild(tr);
    });

    document.getElementById("result").value = payload.output;
    document.getElementById("genWik").style.display = "flex";
    document.getElementById("genAnimation").style.display = "none";
});

const setNewParams = () => {
    
}
