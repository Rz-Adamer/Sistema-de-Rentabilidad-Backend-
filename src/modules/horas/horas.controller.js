const horasService = require("./horas.service");

const getHorasByLider = async (req, res, next) => {
  try {
    if (!req.user?.id_usuario) {
      return res.status(401).json({ success: false, message: "Usuario no autenticado" });
    }
    const horas = await horasService.getHorasByLider(req.user.id_usuario);
    res.status(200).json({ success: true, data: horas });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
};

const getMisHoras = async (req, res, next) => {
  try {
    if (!req.user?.id_usuario) {
      return res.status(401).json({ success: false, message: "Usuario no autenticado" });
    }
    const horas = await horasService.getMisHoras(req.user.id_usuario);
    res.status(200).json({ success: true, data: horas });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
};

const createHora = async (req, res, next) => {
  try {
    if (!req.user?.id_usuario) {
      return res.status(401).json({ success: false, message: "Usuario no autenticado" });
    }
    const hora = await horasService.createHora(req.body, req.user);
    res.status(201).json({ success: true, data: hora });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
};

const updateHora = async (req, res, next) => {
  try {
    if (!req.user?.id_usuario) {
      return res.status(401).json({ success: false, message: "Usuario no autenticado" });
    }
    const hora = await horasService.updateHora(parseInt(req.params.id, 10), req.body, req.user);
    res.status(200).json({ success: true, data: hora });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
};

const deleteHora = async (req, res, next) => {
  try {
    if (!req.user?.id_usuario) {
      return res.status(401).json({ success: false, message: "Usuario no autenticado" });
    }
    await horasService.deleteHora(parseInt(req.params.id, 10), req.user);
    res.status(200).json({ success: true, message: "Registro eliminado correctamente" });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
};

module.exports = {
  getHorasByLider,
  getMisHoras,
  createHora,
  updateHora,
  deleteHora,
};
