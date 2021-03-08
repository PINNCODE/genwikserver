
// Referencias del HTML
const serverStatus  = document.querySelector('#serverStatus');
document.getElementById("genAnimation").style.display = "none";
let filesData;

const socket = io();

document.getElementById("btnGen").style.display = "none";

socket.on('connect', () => {
    //console.log('Conectado');
    serverStatus.innerHTML = 'Conectado';
    serverStatus.setAttribute('class', 'text-success');
    socket.emit('showInputs');
});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    serverStatus.innerHTML = 'Desconectado';
    serverStatus.setAttribute('class', 'text-danger');
});

socket.on('config-files-read', (payload) => {
    console.log(payload)
    if (payload) {
        filesData = payload;
        addCard(payload)
    }
})

const addCard = (components) => {
    components.forEach((item, index) => {
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
    setTimeout( () => {
        var itemOrder = $('#sortableContainer').sortable("toArray");
        itemOrder.forEach( ( item, index ) => {
            document.getElementById(`${item}_index`).innerHTML = `#${index + 1}`;
        })
    }, 100);
}

const setOutPutOptions = () => {
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
                setInputs(item, index, itemOrder)
            }
        })
    }, 100);

}

const getOutput = (item ,index, itemOrder) => {
    let inputs = filesData.filter(
        data => itemOrder[index-1] === data.nombre
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
    let newParams = [];
    var itemOrder = $('#sortableContainer').sortable("toArray");
    if (itemOrder.length) {
        let params = filesData.filter( data => itemOrder[0] === data.nombre);
        newParams.push(params[0])
        console.log(newParams)
        socket.emit('genUi', newParams);
    } else {
        itemOrder.forEach( ( item, index ) => {
            console.log(item);
            if (index === 0){
                let params = filesData.filter( data => item === data.nombre);
                newParams.push(params[0])
            } else {
                let input = document.getElementById(`${item}_select_input`).value;
                let output = document.getElementById(`${item}_select_output`).value;
                console.log(input, output)
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




