const fs = require('fs');
const dir = process.env.CONFIG_PATH;
const hbsDir = process.env.HBS_PATH;

const createConfigFile = (data) => {
    createDir(dir)
    createDir(`${hbsDir}/partials`);
    writeFile(data)
}

const writeFile = (data) => {
    fs.writeFileSync(`./gui-config/${data.nombre}.json`, JSON.stringify(data), (err) => {
        if (err) console.log(`Error al escribir el archivo ${data.nombre}.json: `, err)
    })
}

const createDir = (dirPath) => {
    if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath);
    }
}

const resetDir =  async (dirDelete) => {
    console.log(dirDelete)
    await fs.rmdirSync(dirDelete, { recursive: true });
}

const createUIElements = async (socket) => {
    await fs.readdir(dir, ( err, files) => {
        if (err) throw err
        let data = files.map( (filePath, index) => readJsonFile(`${dir}/${filePath}`));
        socket.emit('config-files-read', data );
    })
}

const readJsonFile = (path) => {
    let rawdata = fs.readFileSync(path);
    let data = JSON.parse(rawdata);
    return data
    //console.log(data)
    //createHbs(data)
}

const createHbs = (uiElements) => {
    parseInputs(uiElements)

}

const parseInputs = (uiFrom) => {
    let partials = ''

    uiFrom.elementosGraficos.entradas.forEach(
        input => {
            partials += `{{> ${uiFrom.nombre}_${input.param}_input }} \n`
            createInput(uiFrom.nombre,input)
        }
    )

    let form = `<div class="row"> 
                <legend>${uiFrom.nombre}</legend>
                    ${ partials }
                </div>`;

    fs.writeFileSync(`${hbsDir}/partials/${uiFrom.nombre}_partial.hbs`,form)

}

const createInput = (formName, inputData) => {
    let inputField = '';
    switch (inputData.tipoG){
        case 'text':
            inputField = `
                <div class="form-group col">
                    <label for="exampleFormControlInput1">${inputData.param}</label>
                    <input type="${inputData.tipoG}" class="form-control" id="${inputData.param}" placeholder="${inputData.descripcion}">
                </div>`
            fs.writeFileSync(`${hbsDir}/partials/${formName}_${inputData.param}_input.hbs`,inputField)
            break;
        case 'number':
            inputField = `
                <div class="form-group col">
                    <label for="exampleFormControlInput1">${inputData.param}</label>
                    <input type="${inputData.tipoG}" class="form-control" id="${inputData.param}" placeholder="${inputData.descripcion}" step="${inputData.decimales}">
                </div>`
            fs.writeFileSync(`${hbsDir}/partials/${formName}_${inputData.param}_input.hbs`,inputField)
            break;
        case 'text':
            inputField = `
                <div class="form-group col">
                    <label for="exampleFormControlInput1">${inputData.param}</label>
                    <input type="${inputData.tipoG}" class="form-control" id="${inputData.param}" placeholder="${inputData.descripcion}" pattern="${inputData.expresionRegular}">
                </div>`
            fs.writeFileSync(`${hbsDir}/partials/${formName}_${inputData.param}_input.hbs`,inputField)
            break;
        default:
            console.log('Tipo no definido', inputData)
            break;
    }
}


module.exports = {
    createConfigFile,
    resetDir,
    createUIElements
};
