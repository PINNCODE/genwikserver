const express = require('express');
const colors = require('colors');
const hbs = require('hbs');
const path = require("path")

const { socketController } = require('../sockets/controller');

class Server {

    constructor() {
        this.app    = express();
        this.port   = process.env.PORT;
        this.server = require('http').createServer( this.app );
        this.io     = require('socket.io')( this.server );
        this.app.set('views', path.join(__dirname,'../views'));
        this.app.set('view engine', 'hbs');
        hbs.registerPartials(path.join(__dirname, "../", "/views/partials"));

        this.paths = {};

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Sockets
        this.sockets();
    }

    middlewares() {
        // Directorio Público
        this.app.use( express.static('public') );
        this.app.use( express.static('../public') );
        this.app.use( express.static('./../public') );
        this.app.use( express.static('./../../public') );
        this.app.use( express.static('./../../../public') );
        this.app.use('/js', express.static(__dirname + '/public'))
    }

    routes() {
        
        this.app.get('/', (req, res) => {
            res.render('home');
        });

        this.app.get('/config', (req, res) => {
            res.render('configGui');
        });

        this.app.get('/gui', (req, res) => {
            res.render('componentGUI');
        });

        this.app.get('/result', (req, res) => {
            res.render('result');
        });
        
    }

    sockets() {
        this.io.on('connection', socketController );
    }

    listen() {
        this.server.listen( this.port, () => {
            console.log(
                'Servidor corriendo en puerto'.brightGreen,
                colors.underline(`http://localhost:${this.port}/`)
            );
        });
    }

}

module.exports = Server;
