const service = require("./dashboard.service");

exports.issueCount = async (req, res, next) => {
    try { res.send(await service.issueCount()); }
    catch (e) { next(e); }
};

exports.citizenCount = async (req, res, next) => {
    try { res.send(await service.citizenCount()); }
    catch (e) { next(e); }
};

exports.staffCount = async (req, res, next) => {
    try { res.send(await service.staffCount()); }
    catch (e) { next(e); }
};

exports.totalRevenue = async (req, res, next) => {
    try { res.send(await service.totalRevenue()); }
    catch (e) { next(e); }
};

exports.groupIssuesByStatus = async (req, res, next) => {
    try { res.send(await service.groupIssuesByStatus(req.query.email)); }
    catch (e) { next(e); }
};

exports.groupIssuesByMonths = async (req, res, next) => {
    try { res.send(await service.groupIssuesByMonths()); }
    catch (e) { next(e); }
};

exports.citizenIssueCountByStatus = async (req, res, next) => {
    try { res.send(await service.citizenIssueCountByStatus(req.params.email)); }
    catch (e) { next(e); }
};