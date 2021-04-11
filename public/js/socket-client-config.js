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
    socket.emit('showInputs');
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
 */
socket.on('config-files-read', (payload) => {
    if (payload) {
        filesData = payload;
        addCard(payload)
    }
})

/**
 * Socket on function
 */
socket.on('gui-created', (payload) => {
    setTimeout(() => {
        document.getElementById("genAnimation").style.display = "none";
        window.location.replace("http://localhost:8080/gui");
    }, 1000)
})

// Referencias del HTML
const serverStatus  = document.querySelector('#serverStatus');
document.getElementById("outputDiv").style.display = "none";

// DOM
document.getElementById("genAnimation").style.display = "none";
document.getElementById("btnGen").style.display = "none";

// Variables
let filesData;
let multComponents = false;

const addCard = (components) => {
    console.log('addCard')
    components.forEach((item, index) => {
        if (components.length){
            this.multComponents = true;
        }
        let card = document.createElement("div");
        card.setAttribute("class", "card mt-2");
        card.setAttribute('id',`${item.nombre}`)
        let cardHeader = document.createElement("div");
        cardHeader.setAttribute("class", "card-header");
        //  data-toggle="collapse" data-target="#demoxd"
        cardHeader.setAttribute('data-toggle', `collapse`)
        cardHeader.setAttribute('data-target', `#${item.nombre}_collapse`)
        let cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body collapse");

        let nodeHeader = document.createTextNode(` ${item.nombre}`);
        //<span class="badge bg-info text-dark">#1</span>
        let span = document.createElement('span');
        span.setAttribute('class', 'badge bg-success');
        span.setAttribute('id', `${item.nombre}_index`);
        let nodeText = document.createTextNode(`#${index + 1}`);
        span.appendChild(nodeText)
        cardHeader.appendChild(span)
        cardHeader.appendChild(nodeHeader);

        let cardText = document.createElement("p");
        cardText.setAttribute("class", "card-text");
        nodeText = document.createTextNode(`Parametros Entrada`);
        cardText.appendChild(nodeText);
        cardBody.appendChild(cardText);
        cardBody.setAttribute('id', `${item.nombre}_collapse`)
        item.elementosGraficos.entradas.forEach((input) => {
            let cardText = document.createElement("p");
            cardText.setAttribute("class", "card-text");

            let nodeText = document.createTextNode(
                `-${input.param} | [ ${input.tipoparam}]`
            );

            cardText.appendChild(nodeText);
            cardBody.appendChild(cardText);
        });

        cardText = document.createElement("p");
        cardText.setAttribute("class", "card-text");
        nodeText = document.createTextNode(`Salida`);
        cardText.appendChild(nodeText);
        cardBody.appendChild(cardText);

        cardText = document.createElement("p");
        cardText.setAttribute("class", "card-text");

        nodeText = document.createTextNode(
            `-${item.elementosGraficos.salida.nombre} | [ ${item.elementosGraficos.salida.tipo}]`
        );

        cardText.appendChild(nodeText);
        cardBody.appendChild(cardText);

        card.appendChild(cardHeader);
        card.appendChild(cardBody);


        document.querySelector("#sortableContainer").appendChild(card);
    });
};

const element = document.querySelector('#draggableContent')
element.addEventListener('mouseup', allowDrop)


function allowDrop(){
    console.log('allowDrop')
    setTimeout( () => {
        var itemOrder = $('#sortableContainer').sortable("toArray");
        itemOrder.forEach( ( item, index ) => {
            document.getElementById(`${item}_index`).innerHTML = `#${index + 1}`;
        })
    }, 100);
}

const  setOutPutOptions = () => {
    console.log('allowDrop')
    $( "#sortableContainer" ).sortable({
        disabled: true
    });
    document.getElementById("btnConfirm").style.display = "none";
    document.getElementById("btnGen").style.display = "inline-block";
    setTimeout( () => {
        var itemOrder = $('#sortableContainer').sortable("toArray");
        itemOrder.forEach( ( item, index ) => {
            if (index != 0){
                getOutput( item, index, itemOrder);
                setInputs(item, index, itemOrder);
            }else{
                document.getElementById("outputDiv").style.display = "block";
                document.getElementById("outputLabel").innerText = `Salida del componente ${item}`;
                document.getElementById("outputAlert").innerText = `De acuerdo al ultimo componente ${item} (respecto al orden de ejecución) ingresa la ruta de la salida que se mostrara en la GUI`;
                const { nombre , tipo } = filesData[0].elementosGraficos.salida;
                document.getElementById("outputInput").placeholder  = `${nombre} | ${tipo}`;
            }
        })
    }, 100);

}

const getOutput = (item ,index, itemOrder) => {
    let inputs = filesData.filter(
        data => {
            return itemOrder[index-1] === data.nombre
        }
    );

    let formSelect = document.createElement('div');
    formSelect.setAttribute('class', 'form-floating mt-2 p-select');

    let select = document.createElement('select');
    select.setAttribute('id', `${item}_select_output`);
    select.setAttribute('class', `form-select`);
    select.setAttribute('disabled', true);

    let label = document.createElement('label')
    let labelText = document.createTextNode(`¿A que entrada del componente ${item} corresponde la salida del componente ${ inputs[0].nombre}`)
    label.appendChild(labelText);

    let output= inputs[0].elementosGraficos.salida;

    let option = document.createElement('option')
    option.setAttribute('value', `${output.nombre}`)
    let nodeText = document.createTextNode(`${output.nombre} [${output.tipo}]`);
    option.appendChild(nodeText);
    select.appendChild(option);

    formSelect.appendChild(select);
    formSelect.appendChild(label)

    document.getElementById(`${item}`).appendChild(formSelect)
}

const setInputs = (item ,index, itemOrder) => {
    console.log('setInputs')
    let inputs = filesData.filter(
        data => itemOrder[index] === data.nombre
    );

    let formSelect = document.createElement('div');
    formSelect.setAttribute('class', 'form-floating mt-2 p-select');

    let select = document.createElement('select');
    select.setAttribute('id', `${item}_select_input`);
    select.setAttribute('class', `form-select`);

    let label = document.createElement('label')
    let labelText = document.createTextNode(`De acuerdo al parametro anteriormente seleccionado a que parametro deseas asignarlo`)
    label.appendChild(labelText);

    inputs[0].elementosGraficos.entradas.forEach( input => {
        let option = document.createElement('option')
        option.setAttribute('value', `${input.param}`)
        let nodeText = document.createTextNode(`${input.param} [${input.tipoparam}]`);
        option.appendChild(nodeText);
        select.appendChild(option);
    });

    formSelect.appendChild(select);
    formSelect.appendChild(label)

    document.getElementById(`${item}`).appendChild(formSelect)
}

const getParams = () => {
    console.log('getParams')
    document.getElementById("genAnimation").style.display = "flex";
    document.getElementById("genWik").style.display = "none";
    document.getElementById("nav").style.display = "none";
    let newParams = [];
    var itemOrder = $('#sortableContainer').sortable("toArray");
    if (itemOrder.length) {
        let valueInput = document.getElementById(`outputInput`).value;
        console.log(valueInput)
        let params = filesData.filter( data => itemOrder[0] === data.nombre);
        newParams.push(params[0])
        console.log(params)
        socket.emit('genUi', { order : newParams, output: valueInput});
    } else {
        itemOrder.forEach( ( item, index ) => {
            if (index === 0){
                let params = filesData.filter( data => item === data.nombre);
                newParams.push(params[0])
            } else {
                let input = document.getElementById(`${item}_select_input`).value;
                let output = document.getElementById(`${item}_select_output`).value;
                let params = filesData.map( data => {
                    if (item === data.nombre){
                        console.log(data)
                        data.elementosGraficos.entradas.map( entrada => {
                            if (entrada.param === input){
                                entrada.valorDefecto = output
                                entrada.soloLectura = true
                            }
                            return entrada
                        })
                    }
                    return data;
                });
            }
        })
    }
    
}




