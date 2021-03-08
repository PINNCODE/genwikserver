const { createConfigFile, createUIElements } = require("./file-system");

let guiData = {
    nombre: '',
    elementosGraficos: {
        entradas: [],
        salida: {
            nombre: 'itemprb',
            tipo: 'rout'
        }
    },
};

const getCarnetData = ( carnetData, socket ) => {
    carnetData.forEach(
        (carnet, i) => {
            guiData.nombre = carnet.data.nivelCero.claveComponente;
            guiData.elementosGraficos.entradas = processInputs(carnet.data.nivelCero.sintaxis);
            guiData.elementosGraficos.salida.nombre = carnet.data.nivelCero.claveComponente;
            guiData.elementosGraficos.salida.tipo = 'rout';

            guiConfigFile(guiData)
            if (carnetData.length - 1 === i){
                socket.emit('config-files-success', true );
            }
        }
    )
}

const processInputs =  (inputs) => {
   let newInputs = inputs.map( input => {
       switch (input.tipoparam){
           case 'int':
               return intPattern(input)
               break;
           case 'float':
           case 'double':
               return floatPattern(input)
               break;
           case 'rout':
               return routPattern(input)
               break;
           case 'boolean':
               return booleanPattern(input)
               break;
           default:
               console.log(input.tipoparam)
               return input;
               break;
       }
   })
    return newInputs
}

const guiConfigFile = (data) => {
    createConfigFile(data)
}

const intPattern = (input) => {
    input.tipoG = 'number';
    input.valorDefecto = null;
    input.soloLectura = false;
    input.oculto = false;
    return input;
}

const floatPattern = (input) => {
    input.tipoG = 'number';
    input.decimales = '0.1'
    input.valorDefecto = null;
    input.soloLectura = false;
    input.oculto = false;
    return input;
}

const routPattern = (input) => {
    input.tipoG = 'text';
    input.valorDefecto = null;
    input.soloLectura = false;
    input.oculto = false;
    input.expresionRegular = ''
    return input;
}

const booleanPattern = (input) => {
    input.tipoG = 'checkbox';
    input.valorDefecto = null;
    input.soloLectura = false;
    input.oculto = false;
    return input;
}

module.exports = {
    getCarnetData
}
