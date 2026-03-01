const service = require("./payments.service");

exports.createBoostCheckout = async (req, res, next) => {
    try { res.send(await service.createBoostCheckout(req.body)); }
    catch (e) { next(e); }
};

exports.boostPaymentSuccess = async (req, res, next) => {
    try { res.send(await service.boostPaymentSuccess(req.query.session_id)); }
    catch (e) { next(e); }
};

exports.createSubscriptionCheckout = async (req, res, next) => {
    try { res.send(await service.createSubscriptionCheckout(req.body)); }
    catch (e) { next(e); }
};

exports.subscriptionPaymentSuccess = async (req, res, next) => {
    try { res.send(await service.subscriptionPaymentSuccess(req.query.session_id)); }
    catch (e) { next(e); }
};

exports.getCitizenPaymentHistory = async (req, res, next) => {
    try { res.send(await service.getCitizenPaymentHistory(req.params.email, req.query.recent)); }
    catch (e) { next(e); }
};

exports.getCitizenSubscriptionPayment = async (req, res, next) => {
    try { res.send(await service.getCitizenSubscriptionPayment(req.params.email)); }
    catch (e) { next(e); }
};