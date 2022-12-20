const { Payment } = require("../models");

module.exports = {
    payment: async(req, res, next) => {
        try {
            const user = req.user;
            const { total } = req.body;

            if (total) {
                const newPayment = await Payment.create({
                    user_id: user.id,
                    total: total,
                    status: false,
                });

                if (!newPayment)
                    return res.render("payment/user-payment", {
                        message: "Payment Failed! Comeback later!",
                    });
            }
            const pendings = await Payment.findAll({ where: { status: false } });
            const confirmed = await Payment.findAll({ where: { status: true } });
            return res.render("payment/user-payment", { pendings, confirmed });
        } catch (error) {
            next(error);
        }
    },
    index: async(req, res, next) => {
        try {
            const paymentsConfirmed = await Payment.findAll({
                where: { status: true },
            });
            const paymentsUnconfirmed = await Payment.findAll({
                where: { status: false },
            });
            return res.render("payment/admin-payment", {
                paymentsConfirmed,
                paymentsUnconfirmed,
            });
        } catch (error) {
            next(error);
        }
    },
    show: async(req, res, next) => {
        try {
            const { id } = req.params;
            const detail = await Payment.findOne({ where: { id } });

            return res.render("payment/detail-payment", { detail });
        } catch (error) {
            next.error;
        }
    },
    update: async(req, res, next) => {
        const { id } = req.params;
        await Payment.update({ status: true }, { where: { id } });
        return res.redirect(`/admin-payment/${id}`);
    },
};