const usuarioService = require('./usuario.service');

const getUsuarios = async (req, res, next) => {
    try {
        // 📌 Verificar que el usuario esté autenticado
        if (!req.user || !req.user.id_usuario) {
            return res.status(401).json({
                success: false,
                message: "Usuario no autenticado",
            });
        }

        const user = req.user; // viene del JWT

        const usuarios = await usuarioService.getUsuarios(user);

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
        const data = req.body;

        const usuario = await usuarioService.createUsuario(data);

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