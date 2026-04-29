const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No hay token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    // 🔑 Extraer token
    const token = authHeader.split(' ')[1];

    // 🔍 Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 💾 Guardar usuario en request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

module.exports = authMiddleware;