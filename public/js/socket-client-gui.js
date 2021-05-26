
const socket = io();
let filesData;
let params;
let orderComponentes = [];

document.getElementById("genAnimation").style.display = "none";


socket.on('connect', () => {
    socket.emit('guiRun');
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
});

socket.on('gui-run', (payload) => {
    let url = new URL(window.location);

    if (payload.order.length > 1) {
        payload.order.forEach(component => {
            component.forEach( name => {
                orderComponentes.push(name.nombre);
            })
        });
        payload.order.map((component, i) => {
            component.map(item => {
                item.elementosGraficos.entradas.forEach( value => {
                    document.getElementById(value.param+'_'+item.nombre).value = url.searchParams.get(value.param)
                });
            })
        });
    }else {
        payload.order[0].elementosGraficos.entradas.forEach( item => {
            document.getElementById(item.param+'_'+payload.order[0].nombre).value = url.searchParams.get(item.param)
        });
    }

    filesData = payload;
})

socket.on('component-exec', (payload) => {
    window.location.replace("http://localhost:8080/result");
})

const executeComponent = () => {
    document.getElementById("genAnimation").style.cssText = 'display:flex !important';
    document.getElementById("genWik").style.display = "none";

    if (filesData.order.length>1) {
        let arrParams = [];
        filesData.order.forEach( data => {
            data.forEach( item => {
                let params = item.elementosGraficos.entradas.map( inputs => {
                    let valueInput = document.getElementById(`${inputs.param}_${item.nombre}`).value;
                    return `-${inputs.param} ${valueInput}`;
                })
                arrParams.push(params)
            })
        })
        setTimeout(() => {
                socket.emit('multiParams', {arrParams, orderComponentes});
            }, 1000)
    }else{
        let component = '';
        filesData.order.forEach( data => {
            component = data.nombre;
            let params = data.elementosGraficos.entradas.map( inputs => {
                let valueInput = document.getElementById(`${inputs.param}_${data.nombre}`).value;
                return `-${inputs.param} ${valueInput}`;
            });
            setTimeout(() => {
                socket.emit('params', {params, component});
            }, 1000);
        })
    }

}
