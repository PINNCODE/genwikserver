
// Referencias del HTML
const serverStatus  = document.querySelector('#serverStatus');
const formFiles = document.querySelector("#formFiles");
document.getElementById("table").style.display = "none";
const btnLoad = document.querySelector('#btnLoad');
let filesData;

formFiles.addEventListener('change', handleFiles, false);

const readFile = (file, onLoadCallback) => {
    let reader = new FileReader();
    reader.onload = onLoadCallback;
    reader.readAsText(file)
}
 
function handleFiles () {
    document.getElementById("carnets").innerHTML = '';
    filesData = this.files;

    if (filesData.length > 0){
        Array.from(filesData).forEach( file => {
            addItemTable(file.name);
        })
    }
    
}

const addItemTable = (nameFile) => {
    document.getElementById("table").style.display = "block";
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let textTd = document.createTextNode(nameFile)
    tr.appendChild(td);
    td.appendChild(textTd);
    document.getElementById("carnets").appendChild(tr);
}

btnLoad.addEventListener('click', () => {

     Array.from(filesData).forEach( file => {
        readFile(file, (data) => {
            let payload = {
                name: file.name,
                data: JSON.parse(data.target.result)
            }
            socket.emit('loadFiles', payload);
        })
    })


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

