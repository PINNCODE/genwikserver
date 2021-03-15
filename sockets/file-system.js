const fs = require('fs');
const dir = process.env.CONFIG_PATH;
const hbsDir = process.env.HBS_PATH;
const { header, footer } = require('./create-gui')
const hbs = require('hbs');
const path = require("path")


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

const writeFileGUI = (data) => {
    fs.writeFileSync(`${hbsDir}/partials/guiConfig.json`, JSON.stringify(data), (err) => {
        if (err) console.log(`Error al escribir el archivo ${data.nombre}.json: `, err)
    })
}

const readFileGUi = () => {
    return readJsonFile(`${hbsDir}/partials/guiConfig.json`)
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

const readUIElements = async (socket) => {
    await fs.readdir(dir, ( err, files) => {
        if (err) throw err
        let data = files.map( (filePath, index) => readJsonFile(`${dir}/${filePath}`));
        socket.emit('config-files-read', data );
    })
}

const createUIElements = (socket, data) => {
    console.log('Creando hbs'.green)
    if (data.length === 1){
        createHbs(data[0])
        createGUI().then( socket.emit('gui-created', data) );
    }else{
        data.forEach( (component, index) => {
            createHbs(component);
            createGUI().then( socket.emit('gui-created', data) );
        })
    }

}

const readJsonFile = (path) => {
    let rawdata = fs.readFileSync(path);
    let data = JSON.parse(rawdata);
    return data
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
                <div class="form-group col-12 mt-2">
                    <label for="exampleFormControlInput1">${inputData.param}</label>
                    <input type="${inputData.tipoG}" class="form-control" id="${inputData.param}_${formName}" placeholder="${inputData.descripcion}">
                </div>`
            fs.writeFileSync(`${hbsDir}/partials/${formName}_${inputData.param}_input.hbs`,inputField)
            break;
        case 'number':
            inputField = `
                <div class="form-group col-12 mt-2">
                    <label for="exampleFormControlInput1">${inputData.param}</label>
                    <input type="${inputData.tipoG}" class="form-control" id="${inputData.param}_${formName}" placeholder="${inputData.descripcion}" step="${inputData.decimales}">
                </div>`
            fs.writeFileSync(`${hbsDir}/partials/${formName}_${inputData.param}_input.hbs`,inputField)
            break;
        case 'text':
            inputField = `
                <div class="form-group col-12 mt-2">
                    <label for="exampleFormControlInput1">${inputData.param}</label>
                    <input type="${inputData.tipoG}" class="form-control" id="${inputData.param}_${formName}" placeholder="${inputData.descripcion}" pattern="${inputData.expresionRegular}">
                </div>`
            fs.writeFileSync(`${hbsDir}/partials/${formName}_${inputData.param}_input.hbs`,inputField)
            break;
        default:
            console.log('Tipo no definido', inputData)
            break;
    }
}

const createGUI = async () => {
    let partials = []
    await fs.readdir(`${hbsDir}/partials`, ( err, files) => {
        if (err) throw err
        files.map( (filePath, index) => {
            if (filePath.search('partial') != -1){
                partials.push(filePath.split(".")[0])
            }
        });
        reWriteGUI(partials);
    })
};

const reWriteGUI = (partials) =>{
    let partialsBody = ''
    partials.forEach( partial => partialsBody += `{{> ${partial} }}\n`);

    let body =  `${header}\n ${partialsBody} \n ${footer}`
    fs.writeFileSync(`./${hbsDir}/componentGUI.hbs`, body, (err) => {
        if (err) console.log(`Error al escribir el archivo componentGUI.hbs: `, err)
    })
    hbs.registerPartials(path.join(__dirname, "../", "/views/partials"));
}

const writeConfigFile = (data) => {
    let parseData = '';
    data.forEach(data => {
        if(data.param != 'CONFIG') return parseData += `${data}\n`
    })
    console.log(parseData)
    fs.writeFileSync(`CONFIG.txt`, parseData, (err) => {
        if (err) console.log(`Error al escribir el archivo componentGUI.hbs: `, err)
    })

    const { exec } = require('child_process');
    exec('java -jar ./OpCX-1.0.jar -CONFIG CONFIG.txt', (err, stdout, stderr) => {
        if (err) {
            console.error(err)
        } else {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        }
    });
}


module.exports = {
    createConfigFile,
    resetDir,
    readUIElements,
    createUIElements,
    writeFileGUI,
    readFileGUi,
    writeConfigFile
};
