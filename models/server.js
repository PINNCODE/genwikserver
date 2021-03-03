const express = require('express');
const colors = require('colors');

const { socketController } = require('../sockets/controller');

class Server {

    constructor() {
        this.app    = express();
        this.port   = process.env.PORT;
        this.server = require('http').createServer( this.app );
        this.io     = require('socket.io')( this.server );
        this.app.set('view engine', 'hbs');

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
    }

    routes() {
        
        this.app.get('*', (req, res) => {
            res.render('home');
        });
        
    }

    sockets() {

        this.io.on('connection', socketController );

    }

    listen() {
        this.server.listen( this.port, () => {
            console.log('' +
                'Servidor corriendo en puerto'.brightGreen,
                colors.underline(`http://localhost:${this.port}/`)
            );
        });
    }

}




module.exports = Server;
