/**
 * Socket lib
 */
const socket = io();

/**
 * Socket coneect
 */
socket.on('connect', () => {
    serverStatus.innerHTML = 'Conectado';
    serverStatus.setAttribute('class', 'text-success');

});

/**
 * Socket disconnect
 */
socket.on('disconnect', () => {
    serverStatus.innerHTML = 'Desconectado';
    serverStatus.setAttribute('class', 'text-danger');
});

/**
 * Socket on function
 * Receives data from socket and navigate to another page
 */
socket.on('config-files-success', (payload) => {
    if (payload){
        setTimeout(() => {
            document.getElementById("genAnimation").style.display = "none";
            document.getElementById("genWik").style.display = "none";
            window.location.replace("http://localhost:8080/config");
        }, 1000)
    }
})

// Referencias del HTML
const serverStatus  = document.querySelector('#serverStatus');
const formFiles = document.querySelector("#formFiles");
const btnLoad = document.querySelector('#btnLoad');

// DOM
document.getElementById("genAnimation").style.display = "none";
document.getElementById("table").style.display = "none";
formFiles.addEventListener('change', handleFiles, false);

// Variables
let filesData;

/**
 * Add name of files on table element
 */
function handleFiles () {
    document.getElementById("carnets").innerHTML = '';
    filesData = this.files;
    if (filesData.length > 0){
        Array.from(filesData).forEach( file => {
            addItemTable(file.name);
        })
    }
    
}

/**
 * Creates one container from tr> td and insert the name of file
 * @param nameFile
 */
const addItemTable = (nameFile) => {
    document.getElementById("table").style.display = "block";
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let textTd = document.createTextNode(nameFile)
    tr.appendChild(td);
    td.appendChild(textTd);
    document.getElementById("carnets").appendChild(tr);
}

/**
 * Event to load array of files to process the information and emit data to socket
 */
btnLoad.addEventListener('click', () => {
    document.getElementById("genWik").style.display = "none";
    document.getElementById("genAnimation").style.display = "block";

    let finaldata = [];

    Array.from(filesData).forEach( (file,i) => {
        readFile(file, (data) => {
            finaldata.push({
                name: file.name,
                data: JSON.parse(data.target.result)
            });
            if (filesData.length -1 === i){
                socket.emit('loadFiles', finaldata);
            }
        })
    })

})

/**
 *  Read the information for the files loaded in the input file
 * @param file
 * @param onLoadCallback
 */
const readFile = (file, onLoadCallback) => {
    let reader = new FileReader();
    reader.readAsText(file)
    reader.onload = onLoadCallback;
}


