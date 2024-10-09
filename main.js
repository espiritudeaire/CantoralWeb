/**
 * Configuración principal de la aplicación usando Express, Mongoose y otras herramientas.
 * 
 * @module App
 */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const ComposerRoute = require('./routes/ComposerRoute');
const ListRoute = require('./routes/ListRoute');
const SongRoute = require('./routes/SongRoute');
const UserRoute = require('./routes/UserRoute');
const SongAndComposerRoute = require('./routes/SongAndComposerRoute');

const app = express();

const PORT = 3000;

const user = 'espiritudeaire';
const password = '7080';
const nameDB = 'cantoral';
const dirDB = 'mongodb+srv://espiritudeaire:123@cluster0.lg823yo.mongodb.net/cantoral?retryWrites=true&w=majority'

/**
 * Conexión a la base de datos MongoDB.
 * 
 * @function mongoose.connect
 * @param {string} dirDB - URI de conexión a MongoDB.
 * @returns {Promise} Retorna una promesa que se resuelve si la conexión es exitosa, o se rechaza si hay un error.
 */
mongoose.connect(dirDB, {})
    .then(() => {
        console.log('Base de datos conectada');
    })
    .catch((err) => {
        console.log('Error en la conexión a la base de datos', err);
    });

// Configuración de EJS
/**
 * Configura el motor de vistas EJS.
 * 
 * @function app.set
 * @param {string} 'view engine' - Configura EJS como el motor de vistas.
 * @param {string} 'views' - Directorio de las vistas.
 */
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

/**
 * Configuración de middlewares.
 * 
 * @function app.use
 * @description Define los middlewares para la aplicación, incluyendo el manejo de archivos estáticos, el parseo de JSON y URLEncoded, manejo de cookies y sesiones.
 */
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Configuración de las sesiones en la aplicación.
 * 
 * @function app.use
 * @param {Object} sessionConfig - Configuración de la sesión, incluyendo el secreto, si se debe guardar de nuevo y si se inicializa sin guardar.
 */
app.use(session({
    secret: '123',
    resave: true,
    saveUninitialized: true
}));

/**
 * Middleware para asignar la sesión a las variables locales de la respuesta.
 * 
 * @function app.use
 * @param {function} middlewareFunction - Función middleware que asigna la sesión del usuario a `res.locals.session`.
 */
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

/**
 * Rutas de la API.
 * 
 * @function app.use
 * @description Define las rutas de la API para compositores, canciones, usuarios, y otras entidades.
 */
app.use('/api', ComposerRoute);
app.use('/api', SongRoute);
app.use('/api', SongAndComposerRoute);
app.use('/api', UserRoute);
app.use('/api', ListRoute);

/**
 * Ruta para la página de inicio.
 * 
 * @name GET /
 * @function
 * @memberof module:App
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @description Renderiza la página de inicio y asigna valores predeterminados a la sesión si el usuario no está autenticado.
 */
app.get('/', (req, res) => {
    if (!req.session.user) {
        req.session.user = {
            user_name: 'default',
            name: 'default',
            last_name: 'default',
            level: 3
        }
    }
    res.render('index', {
        message: '',
        visible: ''
    });
});

/**
 * Ruta para cerrar sesión.
 * 
 * @name GET /cerrar_sesion
 * @function
 * @memberof module:App
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @description Restablece los valores de la sesión a los predeterminados y redirige a la página de inicio.
 */
app.get('/cerrar_sesion', (req, res) => {
    req.session.user = {
        user_name: 'default',
        name: 'default',
        last_name: 'default',
        level: 3
    }
    res.redirect('/');
});

/**
 * Inicia el servidor en el puerto especificado.
 * 
 * @function app.listen
 * @param {number} PORT - El puerto en el que el servidor escuchará las solicitudes.
 * @param {function} callback - Función que se ejecuta una vez que el servidor ha iniciado.
 */
app.listen(PORT, () => {
    console.log('Audiens');
});
