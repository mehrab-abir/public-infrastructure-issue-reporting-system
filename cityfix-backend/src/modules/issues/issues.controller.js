const service = require("./issues.service");

exports.createIssue = async (req, res, next) => {
    try { res.send(await service.createIssue(req.body)); }
    catch (e) { next(e); }
};

exports.editIssue = async (req, res, next) => {
    try { res.send(await service.editIssue(req.params.issueId, req.body)); }
    catch (e) { next(e); }
};

exports.getMyIssues = async (req, res, next) => {
    try { res.send(await service.getMyIssues(req.params.email, req.query.recent)); }
    catch (e) { next(e); }
};

exports.deleteMyIssue = async (req, res, next) => {
    try { res.send(await service.deleteIssue(req.params.issueId)); }
    catch (e) { next(e); }
};

exports.upvoteIssue = async (req, res, next) => {
    try { res.send(await service.upvoteIssue(req.body)); }
    catch (e) { next(e); }
};

exports.getAllIssues = async (req, res, next) => {
    try { res.send(await service.getAllIssues(req.query)); }
    catch (e) { next(e); }
};

exports.getIssueDetails = async (req, res, next) => {
    try { res.send(await service.getIssueDetails(req.params.issueId)); }
    catch (e) { next(e); }
};

exports.getTimeline = async (req, res, next) => {
    try { res.send(await service.getTimeline(req.params.issueId)); }
    catch (e) { next(e); }
};

exports.getIssueReporterInfo = async (req, res, next) => {
    try { res.send(await service.getIssueReporterInfo(req.query)); }
    catch (e) { next(e); }
};

exports.getLatestResolved = async (req, res, next) => {
    try { res.send(await service.getLatestResolved()); }
    catch (e) { next(e); }
};