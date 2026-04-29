const { loginService, registerOwnerService } = require("../auth/auth.service");

const registerOwner = async(req, res) => {
    try {
        const { id_empresa, nombre, email, password } = req.body;

        if (!id_empresa || !nombre || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son obligatorios",
            });
        }

        const newUser = await registerOwnerService(
            id_empresa,
            nombre,
            email,
            password,
        );

        return res.status(201).json({
            success: true,
            message: "Usuario dueño creado correctamente",
            user: newUser,
        });
    } catch (error) {
        if (error.message === "EMAIL_YA_EXISTE") {
            return res.status(409).json({
                success: false,
                message: "Correo ya registrado",
            });
        }

        if (error.message === "EMAIL_INVALIDO") {
            return res.status(400).json({
                success: false,
                message: "Correo inválido",
            });
        }
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor",
        });
    }
};

const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        //Validación básica
        if (!email || !password) {
            return res.status(400).json({
                message: "Email y contraseña son obligatorios",
            });
        }

        const result = await loginService(email, password);

        return res.status(200).json({
            message: "Login exitoso",
            token: result.token,
            user: result.user,
        });
    } catch (error) {
        if (error.message === "CREDENCIALES_INVALIDAS") {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        if (error.message === "USUARIO_INACTIVO") {
            return res.status(403).json({ message: "Usuario inactivo" });
        }

        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = {
    login,
    registerOwner,
};