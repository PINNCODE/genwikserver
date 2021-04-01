
// Referencias del HTML
const serverStatus  = document.querySelector('#serverStatus');
document.getElementById("genAnimation").style.display = "none";
const formFiles = document.querySelector("#formFiles");
document.getElementById("table").style.display = "none";
const btnLoad = document.querySelector('#btnLoad');
let filesData;

formFiles.addEventListener('change', handleFiles, false);

const socket = io();

const readFile = (file, onLoadCallback) => {
    let reader = new FileReader();
    reader.readAsText(file)
    reader.onload = onLoadCallback;
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

socket.on('config-files-success', (payload) => {
    console.log('config-files-success',payload)
   if (payload){
       setTimeout(() => {
           document.getElementById("genAnimation").style.display = "none";
           document.getElementById("genWik").style.display = "none";
           window.location.replace("http://localhost:8080/config");
       }, 1000)
   }
})


