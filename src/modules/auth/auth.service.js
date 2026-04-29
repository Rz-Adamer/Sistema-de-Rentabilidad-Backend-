const authRepository = require("../auth/auth.repository");
const { comparePassword } = require("../../utils/hash");
const { generateToken } = require("../../utils/jwt");

const loginService = async(email, password) => {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
        throw new Error("CREDENCIALES_INVALIDAS");
    }

    if (!user.is_active) {
        throw new Error("USUARIO_INACTIVO");
    }

    const validPassword = await comparePassword(password, user.password);

    if (!validPassword) {
        throw new Error("CREDENCIALES_INVALIDAS");
    }

    const token = generateToken({
        id_usuario: user.id_usuario,
        email: user.email,
        rol: user.rol,
    });

    return {
        token,
        user: {
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol,
        },
    };
};

module.exports = { loginService };