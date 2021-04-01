// Configuracion de variables de entorno
require('dotenv').config();

// Clase del servidor
const Server = require('./src/models/server');
const server = new Server();

// Inicializacion del servicio
server.listen();
