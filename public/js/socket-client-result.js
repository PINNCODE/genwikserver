const socket = io();

// Ref HTML
document.getElementById("genWik").style.display = "none";
document.getElementById("genWikError").style.display = "none";
let paramsTable = document.getElementById("paramsTable");

// Variables
let params;

socket.on('connect', () => {
    console.log('Conectado');
    socket.emit('loadResult');
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
});

socket.on('resultReady', (payload) => {

    this.params = payload.values;

    if (!payload.error){
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
    }else {
        document.getElementById("genWikError").style.display = "flex";
        document.getElementById("errorObj").innerHTML = JSON.stringify(payload.output);
        document.getElementById("genAnimation").style.display = "none";
    }


});

const setNewParams = () => {
    let urlParams = '';
    this.params.forEach((resp,i) => {
        urlParams += resp[0].replace('-','') + '=' + resp[1];
        if (i != this.params.length-1){
            urlParams += '&';
        }
    });
    urlParams = 'http://localhost:8080/gui?reload=true&' + urlParams;
    window.location.href = urlParams;
}
