const service = require("./users.service");

exports.getUserRole = async (req, res, next) => {
    try { res.send(await service.getUserRole(req.params.email)); }
    catch (e) { next(e); }
};

exports.createUser = async (req, res, next) => {
    try { res.send(await service.createUser(req.body)); }
    catch (e) { next(e); }
};

exports.updateProfile = async (req, res, next) => {
    try { res.send(await service.updateProfile(req.params.email, req.query.role, req.body)); }
    catch (e) { next(e); }
};

exports.getUserByUid = async (req, res, next) => {
    try { res.send(await service.getUserByUid(req.params.uid)); }
    catch (e) { next(e); }
};