const roleMiddleware = (...rolesPermitidos) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      // ❌ No hay usuario (no pasó authMiddleware)
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'No autenticado'
        });
      }

      // 🔍 DEBUG: Log para verificar rol
      console.log('🔍 [roleMiddleware DEBUG]');
      console.log('   Usuario completo:', JSON.stringify(user, null, 2));
      console.log('   user.rol =>', user.rol);
      console.log('   Roles permitidos =>', rolesPermitidos);
      console.log('   ¿Incluye rol? =>', rolesPermitidos.includes(user.rol));

      // ❌ Rol no permitido
      if (!rolesPermitidos.includes(user.rol)) {
        console.log('❌ Rol rechazado. Rol recibido:', JSON.stringify(user.rol), 'Roles esperados:', rolesPermitidos);
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para esta acción'
        });
      }

      console.log('✅ Rol permitido. Continuando...');
      next();
    } catch (error) {
      console.error('❌ Error en roleMiddleware:', error);
      return res.status(500).json({
        success: false,
        message: 'Error en validación de rol'
      });
    }
  };
};

module.exports = roleMiddleware;