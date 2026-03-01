const service = require("./staff.service");

exports.getAssignedIssues = async (req, res, next) => {
    try { res.send(await service.getAssignedIssues(req.params.email, req.query)); }
    catch (e) { next(e); }
};

exports.updateIssueStatus = async (req, res, next) => {
    try { res.send(await service.updateIssueStatus(req.body)); }
    catch (e) { next(e); }
};

exports.getResolvedIssues = async (req, res, next) => {
    try { res.send(await service.getResolvedIssues(req.params.email, req.query.recent)); }
    catch (e) { next(e); }
};