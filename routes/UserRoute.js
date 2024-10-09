/**
 * Módulo de rutas de usuario que define las rutas relacionadas con la autenticación y la gestión de listas de canciones.
 * 
 * @module UserRoute
 */

const express = require('express');
const UserRoute = express.Router();
const UserController = require('../controllers/UserController');

/**
 * Ruta para la autenticación de usuarios.
 *
 * @name POST /authentication
 * @function
 * @memberof module:UserRoute
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} req.body - El cuerpo de la solicitud que contiene `user_name` y `password`.
 * @param {Object} res - El objeto de respuesta de Express.
 * @description Este endpoint recibe las credenciales del usuario y llama al controlador para realizar la autenticación.
 */
UserRoute.post('/authentication', UserController.authentication);

/**
 * Ruta para obtener todas las listas de canciones de un usuario autenticado.
 *
 * @name GET /getAllLists
 * @function
 * @memberof module:UserRoute
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} req.session - La sesión del usuario autenticado.
 * @param {Object} res - El objeto de respuesta de Express.
 * @description Este endpoint recupera todas las listas de canciones asociadas al usuario autenticado, llamando al controlador correspondiente.
 */
UserRoute.get('/getAllLists', UserController.getAllLists);

/**
 *  Define una ruta HTTP GET para abrir la configuración del usuario
 */
UserRoute.get('/open_user_config', UserController.open_user_config);

module.exports = UserRoute;
