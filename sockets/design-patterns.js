const fs = require('fs');

let guiData = {
    nombre: '',
    elementosGraficos: {
        entradas: [],
        salida: {
            nombre: '',
            tipo: ''
        }
    },
};

const getCarnetData = ( carnetData ) => {
    guiData.nombre = carnetData.data.nivelCero.claveComponente;
    guiData.elementosGraficos.entradas = processInputs(carnetData.data.nivelCero.sintaxis);
    guiConfigFile(guiData)

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
    console.log('Creando archivo: ', data.nombre);

    fs.writeFileSync(`./gui-config/${data.nombre}.json`, JSON.stringify(data), (err) => {
        if (err) console.log(`Error al escribir el archivo ${data.nombre}.json: `, err)
        console.log('Archivo escrito: ', data.nombre);
    })
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
