/**
 * Módulo de controlador de usuarios que gestiona la autenticación y manipulación de listas.
 * 
 * @module UserController
 */

const mongoose = require('mongoose');
const User = require('../models/User');

const UserController = {
    /**
     * Método para autenticar a un usuario.
     *
     * @async
     * @function authentication
     * @param {Object} req - El objeto de solicitud de Express.
     * @param {Object} req.body - Cuerpo de la solicitud que contiene `user_name` y `password`.
     * @param {string} req.body.user_name - Nombre de usuario ingresado.
     * @param {string} req.body.password - Contraseña ingresada.
     * @param {Object} res - El objeto de respuesta de Express.
     * @returns {void}
     */
    authentication: async (req, res) => {
        try {
            let { user_name, password } = req.body;
            
            // Busca el usuario por nombre de usuario en la base de datos
            let user = await User.findOne({ user_name }, '_id name last_name level user_name password');
            
            if (user) {
                if (password === user.password) {
                    console.log("INFORMACIÓN CORRECTA DEL USUARIO");
                    
                    // Guarda la información del usuario en la sesión
                    req.session.user = {
                        _id: user._id,
                        user_name,
                        name: user.name,
                        last_name: user.last_name,
                        level: user.level
                    };
                    
                    // Redirige a la página principal
                    res.status(200).redirect('/');
                } else {
                    console.log("contraseña incorrecta");
                    // Renderiza la vista de inicio con un mensaje de error
                    res.status(400).render('index', {
                        message: 'Contraseña incorrecta',
                        visible: '_on'
                    });
                }
            } else {
                console.log("no existe el usuario");
                // Renderiza la vista de inicio con un mensaje de error
                res.status(400).render('index', {
                    message: 'No existe el usuario',
                    visible: '_on'
                });
            }
        } catch (error) {
            // Envía un error en caso de falla en la autenticación
            res.status(400).send({
                message: error,
                success: false
            });
        }
    },

    /**
     * Obtiene todas las listas de canciones de un usuario autenticado.
     *
     * @async
     * @function getAllLists
     * @param {Object} req - El objeto de solicitud de Express.
     * @param {Object} req.session.user - La sesión del usuario autenticado.
     * @param {string} req.session.user.user_name - Nombre de usuario almacenado en la sesión.
     * @param {Object} res - El objeto de respuesta de Express.
     * @returns {void}
     */
    getAllLists: async (req, res) => {
        try {
            // Busca las listas del usuario y las popula con las canciones asociadas
            let allLists = await User.findOne({ user_name: req.session.user.user_name }, 'lists')
                .populate({
                    path: 'lists',
                    populate: { path: 'songs' }
                });
                
            // Responde con las listas obtenidas
            res.status(200).json({
                allLists,
                success: true
            });
        } catch (error) {
            // Responde con un error en caso de falla en la obtención de listas
            res.status(400).json({
                message: error,
                success: false
            });
        }
    },

    /**
     * Guarda una lista de canciones para el usuario autenticado.
     *
     * @async
     * @function saveList
     * @param {Object} req - El objeto de solicitud de Express.
     * @param {Object} req.query - Los parámetros de consulta de la solicitud.
     * @param {string} req.query.id_song - El ID de la canción que se desea guardar en la lista.
     * @param {Object} res - El objeto de respuesta de Express.
     * @returns {void}
     */
    saveList: async (req, res) => {
        try {
            let id_Song = req.query.id_song;
            // Aquí se debería implementar la lógica para guardar la lista
        } catch (error) {
            // Envía un error en caso de falla en la operación de guardado
            res.status(400).send({
                message: error,
                success: false
            });
        }
    },

    open_user_config: async(req, res)=>{
        try {
            let allUsers = await User.find();
            console.log("USUARIOS: ----", allUsers);
            res.status(200).render('user_config', {
                success: true,
                allUsers
            });
        } catch (error) {
            res.status(400).send({
                message: error,
                success: false
            });
        }
    },

    getAllUsers: async(req, res)=>{
        try {
            let allUsers = await User.find();
            res.status(200).json({
                allUsers,
                success: true
            });
        } catch (error) {
            res.status(400).send({
                message: error,
                success: false
            });
        }
    }
};

module.exports = UserController;
