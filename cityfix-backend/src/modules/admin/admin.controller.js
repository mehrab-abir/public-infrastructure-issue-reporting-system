const service = require("./admin.service");

exports.getAllUsers = async (req, res, next) => {
    try { res.send(await service.getAllUsers(req.query)); }
    catch (e) { next(e); }
};

exports.rejectIssue = async (req, res, next) => {
    try { res.send(await service.rejectIssue(req.query)); }
    catch (e) { next(e); }
};

exports.getAllStaffs = async (req, res, next) => {
    try { res.send(await service.getAllStaffs(req.query)); }
    catch (e) { next(e); }
};

exports.assignStaff = async (req, res, next) => {
    try { res.send(await service.assignStaff(req.body)); }
    catch (e) { next(e); }
};

exports.deleteIssue = async (req, res, next) => {
    try { res.send(await service.deleteIssue(req.params.issueId)); }
    catch (e) { next(e); }
};

exports.registerStaff = async (req, res, next) => {
    try { res.send(await service.registerStaff(req.body)); }
    catch (e) { next(e); }
};

exports.updateStaff = async (req, res, next) => {
    try { res.send(await service.updateStaff(req.params.uid, req.body)); }
    catch (e) { next(e); }
};

exports.deleteStaff = async (req, res, next) => {
    try { res.send(await service.deleteStaff(req.params.uid)); }
    catch (e) { next(e); }
};

exports.toggleBlockUser = async (req, res, next) => {
    try { res.send(await service.toggleBlockUser(req.params.email)); }
    catch (e) { next(e); }
};

exports.toggleAdminRole = async(req,res,next)=>{
    const {email} = req.params;
    const {newRole} = req.body;

    try{
        res.send(await service.toggleAdminRole(email, newRole));
    }
    catch(e){
        next(e);
    }
}

exports.allPayments = async (req, res, next) => {
    try { res.send(await service.allPayments()); }
    catch (e) { next(e); }
};

exports.subscriptionPayments = async (req, res, next) => {
    try { res.send(await service.subscriptionPayments()); }
    catch (e) { next(e); }
};