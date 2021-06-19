const { createConfigFile } = require("./file-system");

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
            guiData.elementosGraficos.salida.param =carnet.data.nivelCero.salida.param;
            guiData.elementosGraficos.salida.valorPorDefecto =carnet.data.nivelCero.salida.valorPorDefecto;
            guiData.elementosGraficos.salida.tipo = carnet.data.nivelCero.salida.tipoparam;

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
           case 'rout_bin':
           case 'string':
               return routPattern(input)
               break;
           case 'date':
               return datePattern(input);
               break;
           case 'boolean':
               return booleanPattern(input)
               break;
           default:
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

const datePattern = (input) => {
    input.tipoG = 'date';
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
