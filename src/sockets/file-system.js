// FileSystem
const fs = require('fs');
// Directorio de configuracion de GUI
const dir = process.env.CONFIG_PATH;
// Directorio de los HBS (views)
const hbsDir = process.env.HBS_PATH;
// Elementos estaticos para la creacion de la plantilla
const { header, footer } = require('./create-gui')
// hbs lib
const hbs = require('hbs');
// path lib
const path = require("path")

const createConfigFile = (data) => {
    createDir(dir)
    createDir(`./src/${hbsDir}/partials`);
    writeFile(data)
}

/*
    Escribe los archivos de configuracion de los componentes dentro del path /gui-config
    Recibe la data de configuracion como parametro
 */
const writeFile = (data) => {
    fs.writeFileSync(`./src/gui-config/${data.nombre}.json`, JSON.stringify(data), (err) => {
        if (err) console.log(`Error al escribir el archivo ${data.nombre}.json: `, err)
    })
}

/*
    Escribe los archivos de configuracion del proyecto en general dentro del path /gui-config/partials
    Recibe la data de configuracion como parametro
 */
const writeFileGUI = (data) => {
    fs.writeFileSync(`./src/${hbsDir}/partials/guiConfig.json`, JSON.stringify(data), (err) => {
        if (err) console.log(`Error al escribir el archivo ${data.nombre}.json: `, err)
    })
}

/*
    Lee el archivo de configuracion de guiConfig y retorna el valor que tiene dentro
 */
const readFileGUi = () => {
    return readJsonFile(`./src/${hbsDir}/partials/guiConfig.json`)
}

/*
    Crea los directorios en el proyecto segun la ruta que reciba por parametro
 */
const createDir = (dirPath) => {
    if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath);
    }
}

/*
    Elimina los directorios creados en una ejecución pasada para volver a crear una nueva GUI
 */
const resetDir =  async (dirDelete) => {
    await fs.rmdirSync(dirDelete, { recursive: true });
}

/*
    Lee los elementos creados en el directorio de gui-config y retorna el valor que hay dentro de ellos
 */
const readUIElements = async (socket) => {
    await fs.readdir(dir, ( err, files) => {
        if (err) throw err
        let data = files.map( (filePath, index) => readJsonFile(`${dir}/${filePath}`));
        socket.emit('config-files-read', data );
    })
}

/*
    Crea los elemtos hbs (atoms) para generar una GUI (molecule)
    Emite una señal al socket y envia la data leida de la GUI
 */
const createUIElements = (socket, data) => {
    if (data.order.length === 1){
        createHbs(data.order[0])
        createGUI().then( socket.emit('gui-created', data) );
    }else{
        data.order.forEach( (component, index) => {
            component.forEach( itemComponent => {
                createHbs(itemComponent);
                createGUI().then( socket.emit('gui-created', data) );
            })
        })
    }

}

/*
    Funcion para leer la data almacenada en algun archivo JSON
 */
const readJsonFile = (path) => {
    let rawdata = fs.readFileSync(path);
    let data = JSON.parse(rawdata);
    return data
}

// Funcion para crear los hbs recibe la configuracion GUI y crea el HBS
const createHbs = (uiElements) => {
    parseInputs(uiElements)
}

/*
 Segun la configuracion de GUI recibida crea un hbs (atom)
 Escribe el HBS dentro de views/partials/
 */

const parseInputs = (uiFrom) => {

    let totalInputs =  uiFrom.elementosGraficos.entradas.length;
    let grids = totalInputs <= 2 ? 6 : totalInputs === 3 ? 4 : totalInputs <= 8 ? 3 : totalInputs <= 12 ? 2 : 1;
    let partials = '';

    uiFrom.elementosGraficos.entradas.forEach(
        input => {
            partials += `{{> ${uiFrom.nombre}_${input.param}_input }} \n`
            createInput(uiFrom.nombre,input, grids)
        }
    )

    let form = `<div class="row"> 
                <legend>${uiFrom.nombre}</legend>
                    ${ partials }
                </div>`;

    fs.writeFileSync(`./src/${hbsDir}/partials/${uiFrom.nombre}_partial.hbs`,form)

}

const createInput = (formName, inputData, gridNumber) => {
    let inputField = '';
    switch (inputData.tipoG){
        case 'text':
            inputField = `
                <div class="form-group col-${gridNumber} mt-2">
                    <label for="exampleFormControlInput1">${inputData.param}</label>
                    <input type="${inputData.tipoG}" class="form-control" id="${inputData.param}_${formName}" placeholder="${inputData.descripcion}">
                </div>`
            fs.writeFileSync(`./src/${hbsDir}/partials/${formName}_${inputData.param}_input.hbs`,inputField)
            break;
        case 'number':
            inputField = `
                <div class="form-group col-${gridNumber} mt-2">
                    <label for="exampleFormControlInput1">${inputData.param}</label>
                    <input type="${inputData.tipoG}" class="form-control" id="${inputData.param}_${formName}" placeholder="${inputData.descripcion}" step="${inputData.decimales}">
                </div>`
            fs.writeFileSync(`./src/${hbsDir}/partials/${formName}_${inputData.param}_input.hbs`,inputField)
            break;
        case 'string':
        case 'ruta_bin':
            inputField = `
                <div class="form-group col-${gridNumber} mt-2">
                    <label for="exampleFormControlInput1">${inputData.param}</label>
                    <input type="${inputData.tipoG}" class="form-control" id="${inputData.param}_${formName}" placeholder="${inputData.descripcion}" pattern="${inputData.expresionRegular}">
                </div>`
            fs.writeFileSync(`./src/${hbsDir}/partials/${formName}_${inputData.param}_input.hbs`,inputField)
            break;
        case 'date':
            inputField = `
                <div class="form-group col-${gridNumber} mt-2">
                    <label for="exampleFormControlInput1">${inputData.param}</label>
                    <input type="${inputData.tipoG}" class="form-control" id="${inputData.param}_${formName}" placeholder="${inputData.descripcion}" pattern="${inputData.expresionRegular}">
                </div>`
            fs.writeFileSync(`./src/${hbsDir}/partials/${formName}_${inputData.param}_input.hbs`,inputField)
            break;
        case 'checkbox':
            inputField = `
                <div class="form-group form-check col-${gridNumber} mt-2 custom-check-box">
                    <input class="form-check-input" id="${inputData.param}_${formName}" type="${inputData.tipoG}" value="${inputData.valorDefecto}">
                    <label class="form-check-label" >
                        ${inputData.param}
                    </label>
                </div>`
            fs.writeFileSync(`./src/${hbsDir}/partials/${formName}_${inputData.param}_input.hbs`,inputField)
            break;
        default:
            console.log('Tipo no definido', inputData)
            break;
    }
}

const createGUI = async () => {
    let partials = []
    await fs.readdir(`./src/${hbsDir}/partials`, ( err, files) => {
        if (err) throw err
        files.map( (filePath, index) => {
            if (filePath.search('partial') != -1){
                partials.push(filePath.split(".")[0])
            }
        });
        reWriteGUI(partials);
    })
};

const createComand = () => {
    return fs.readdirSync(`./components`,  ( err, files) => {
        if (err) throw err
        return files;
    })
};

const reWriteGUI = (partials) =>{
    let partialsBody = ''
    partials.forEach( partial => partialsBody += `{{> ${partial} }}\n`);

    let body =  `${header}\n ${partialsBody} \n ${footer}`
    fs.writeFileSync(`./src/${hbsDir}/componentGUI.hbs`, body, (err) => {
        if (err) console.log(`Error al escribir el archivo componentGUI.hbs: `, err)
    })
    hbs.registerPartials(path.join(__dirname, "../", "/views/partials"));
}

const writeConfigFile = (data, socket) => {
    const { exec } = require('child_process');
    let comp = createComand();
    comp = comp.filter(components => components.includes(data.component))
    let parseData = '';

    data.params.forEach(param => {
        if(param.param !== 'CONFIG') return parseData += `${param}\n`
    });

    fs.writeFileSync(`CONFIG.txt`, parseData, (err) => {
        if (err) console.log(`Error al escribir el archivo componentGUI.hbs: `, err);
        console.log(`Archivo CONFIG.txt creado`)
    });

    exec(`java -jar ./components/${comp} -CONFIG CONFIG.txt`, (err, stdout, stderr) => {
        if (err) {
            console.error('->', err)
        } else {
            console.log(`Se ejecuto el componente ${comp}`)
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            socket.emit('component-exec');
        }
    });

}

const writeConfigMultiFile = (data, socket) => {
    let comp = createComand();
    let parseData = '';
    data.arrParams.forEach(item => {
        item.forEach(data => {
            if(data.param != 'CONFIG') return parseData += `${data}\n`
        })
    });


    fs.writeFileSync(`CONFIG.txt`, parseData, (err) => {
        if (err) console.log(`Error al escribir el archivo componentGUI.hbs: `, err)
    });

    const { exec} = require('child_process');

    console.log(data.orderComponentes);
    data.orderComponentes.forEach( component => {
        comp.forEach(jar => {
            if (jar.includes(component)){
                console.log(`Ejecutando el comando java -jar ./components/${jar} -CONFIG CONFIG.txt`)
                exec(`java -jar ./components/${jar} -CONFIG CONFIG.txt`, (err, stdout, stderr) => {
                    if (err) {
                        console.error('->', err)
                    } else {
                        console.log(`Se ejecuto el componente ${jar}`)
                        console.log(`stdout: ${stdout}`);
                        socket.emit('component-exec');
                    }
                });
            }
        });
    });
}

const createResult = (socket) => {
    let rawdata = fs.readFileSync('CONFIG.txt').toString()
    let tokens = rawdata.split('\n')
    let tokensSanitizer = tokens.map(  token =>
        token.split(' ')
    );
    tokensSanitizer = tokensSanitizer.filter(item => item != '');
    let output = readJsonFile(`./src/${hbsDir}/partials/guiConfig.json`);
    fs.readFile(output.output, 'utf8', function(err, data) {
        if (err) {
            console.warn(err)
            setTimeout(() => {
                socket.emit('resultReady', {
                    error: true,
                    output: err
                })
            });
        }else{
            setTimeout(() => {
                socket.emit('resultReady', {
                    values: tokensSanitizer,
                    output: data
                })
            });
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
    writeConfigFile,
    writeConfigMultiFile,
    createComand,
    createResult
};
