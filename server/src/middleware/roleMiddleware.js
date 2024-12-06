const ApiError = require('../error/ApiError');

module.exports = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return next(ApiError.forbidden('Нет доступа'));
        }
        next();
    };
};