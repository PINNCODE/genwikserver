
// Referencias del HTML
const serverStatus  = document.querySelector('#serverStatus');
const formFiles = document.querySelector("#formFiles");
document.getElementById("table").style.display = "none";
const btnLoad = document.querySelector('#btnLoad');
let filesData;

formFiles.addEventListener('change', handleFiles, false);

function readFile(input){
    addItemTable(input.name);
    let reader = new FileReader();

    reader.readAsText(input)

    reader.onload = () => {
        return reader.result;
    }
}

function handleFiles() {
    document.getElementById("carnets").innerHTML = '';
    filesData = this.files;

    if (filesData.length > 0){
        Array.from(filesData).map( file => readFile(file))
    }
    
}

function addItemTable(nameFile){
    document.getElementById("table").style.display = "block";
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let textTd = document.createTextNode(nameFile)
    tr.appendChild(td);
    td.appendChild(textTd);
    document.getElementById("carnets").appendChild(tr);
}

btnLoad.addEventListener('click', () => {

    const payload = Array.from(filesData).map( file => {
        return {
            name : file.name,
            data: file
        }
    })
    socket.emit('loadFiles', payload);

})

const socket = io();

socket.on('connect', () => {
    // console.log('Conectado');
    serverStatus.innerHTML = 'Conectado';
    serverStatus.setAttribute('class', 'text-success');

});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    serverStatus.innerHTML = 'Desconectado';
    serverStatus.setAttribute('class', 'text-danger');
});

