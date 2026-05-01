const usuarioService = require('./usuario.service');

const getUsuarios = async (req, res, next) => {
    try {
        const user = req.user; // viene del JWT
        const usuarios = await usuarioService.getUsuarios(user);

        // ✅ Caso: no hay usuarios registrados
        if (usuarios.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No hay usuarios disponibles",
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            data: usuarios
        });
    } catch (error) {
        next(error);
    }
};

const createUsuario = async (req, res, next) => {
    try {
        const usuario = await usuarioService.createUsuario(
            req.body,
            req.user
        );

        res.status(201).json({
            success: true,
            data: usuario
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsuarios,
    createUsuario
};