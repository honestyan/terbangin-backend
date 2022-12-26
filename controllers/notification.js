const { Transaction, Notification } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  hadlingPayment: async (req, res, next) => {
    try {
      const { transaction_status, order_id } = req.body;

      const transaction = await Transaction.findOne({
        where: { payment_id: order_id },
      });

      if (!transaction) {
        return res.status(401).json({
          status: false,
          message: "transaction not found",
          data: transaction,
        });
      }

      const transactionUpdate = await Transaction.update(
        { status: transaction_status },
        { where: { payment_id: order_id } }
      );

      if (!transactionUpdate) {
        return res.status(401).json({
          status: false,
          message: "failed update transaction",
          data: transactionUpdate,
        });
      }

      //insert to notification
      const notification = await Notification.create({
        title: "Payment Status",
        body: `Your payment status is ${transaction_status}`,
        user_id: transaction.user_id,
        transaction_id: transaction.id,
        is_read: false,
      });

      const updatedTransaction = await Transaction.findOne({
        where: { payment_id: order_id },
      });

      return res.status(200).json({
        status: true,
        message: "status updated",
        data: updatedTransaction,
      });
    } catch (error) {
      next(error);
    }
  },

  isRead: async (req, res, next) => {
    try {
      const { id } = req.params;

      const notification = await Notification.findOne({
        where: { id },
      });

      if (!notification) {
        return res.status(401).json({
          status: false,
          message: "notification not found",
          data: notification,
        });
      }

      const notificationUpdate = await Notification.update(
        { is_read: true },
        { where: { id } }
      );

      if (!notificationUpdate) {
        return res.status(401).json({
          status: false,
          message: "failed update notification",
          data: notificationUpdate,
        });
      }

      const updatedNotification = await Notification.findOne({
        where: { id },
      });

      return res.status(200).json({
        status: true,
        message: "notification updated",
        data: updatedNotification,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllByUser: async (req, res, next) => {
    try {
      const token = req.user;
      const { page, limit } = req.query;
      const offset = (page - 1) * limit;

      const notifications = await Notification.findAndCountAll({
        where: { user_id: token.id },
        limit,
        offset,
      });

      if (!notifications.rows.length) {
        return res.status(400).json({
          status: false,
          message: "no notification found",
          data: notifications,
        });
      }

      return res.status(200).json({
        status: true,
        message: "success get all notification",
        data: notifications.rows,
      });
    } catch (error) {
      next(error);
    }
  },

  //only admin can get all notification
  getAll: async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const offset = (page - 1) * limit;

      const notifications = await Notification.findAndCountAll({
        limit,
        offset,
      });

      if (!notifications.rows.length) {
        return res.status(400).json({
          status: false,
          message: "no notification found",
          data: notifications,
        });
      }

      return res.status(200).json({
        status: true,
        message: "success get all notification",
        data: notifications.rows,
      });
    } catch (error) {
      next(error);
    }
  },

  //only admin can delete notification
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const notification = await Notification.findOne({
        where: { id },
      });

      if (!notification) {
        return res.status(401).json({
          status: false,
          message: "notification not found",
          data: notification,
        });
      }

      const notificationDelete = await Notification.destroy({
        where: { id },
      });

      if (!notificationDelete) {
        return res.status(401).json({
          status: false,
          message: "failed delete notification",
          data: notificationDelete,
        });
      }

      return res.status(200).json({
        status: true,
        message: "notification deleted",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },

  //only admin can create notification
  create: async (req, res, next) => {
    try {
      const { title, body, user_id, transaction_id } = req.body;

      const notification = await Notification.create({
        title,
        body,
        user_id,
        transaction_id,
        is_read: false,
      });

      if (!notification) {
        return res.status(401).json({
          status: false,
          message: "failed create notification",
          data: notification,
        });
      }

      return res.status(200).json({
        status: true,
        message: "notification created",
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  },

  //only admin can update notification
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, body, user_id, transaction_id } = req.body;

      const notification = await Notification.findOne({
        where: { id },
      });

      if (!notification) {
        return res.status(401).json({
          status: false,
          message: "notification not found",
          data: notification,
        });
      }

      const notificationUpdate = await Notification.update(
        {
          title,
          body,
          user_id,
          transaction_id,
          is_read: false,
        },
        { where: { id } }
      );

      if (!notificationUpdate) {
        return res.status(401).json({
          status: false,
          message: "failed update notification",
          data: notificationUpdate,
        });
      }

      const updatedNotification = await Notification.findOne({
        where: { id },
      });

      return res.status(200).json({
        status: true,
        message: "notification updated",
        data: updatedNotification,
      });
    } catch (error) {
      next(error);
    }
  },
  //this search can use user_id, title, is read optionally
  search: async (req, res, next) => {
    try {
      let  user_id ;
      const title = req.query.title || "";
      const is_read = req.query.is_read;
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const offset = limit * page;

      //There are two possibilities that use the search notification feature, namely user and admin. 
      //If the user is accessing it, the where condition will increase with the user_id. 
      //If admin is accesing it, this will return notifications from all users, 
      //the admin can add req.query.user_id if the admin wants to see notifications from a specific user.
      if(req.hasOwnProperty('user')){
        user_id = req.user.id
      }else if (req.query.user_id){
        user_id = req.query.user_id
      }
      //define where, using the "LIKE" condition because if there is a value between the "%" signs, it will search for rows containing that value, 
      //but if there is no carachter between the "%" it is the same as ignoring the "LIKE" condition.
      //Example : SELECT * FROM NOTIFICATION WHERE title LIKE "%%" ;
      //Is same with : SELECT * FROM NOTIFICATION ;
      const where = {};
      where[Op.and] = [{
        title:{
          [Op.iLike]: "%" + title + "%"
        },
      }];

      
      //"LIKE" is not used to avoid the possibility that the user will see another user's notification.
      //Example : "SELECT * FROM NOTIFICATION WHERE user_id 'LIKE %1%' ";
      //Notifications that appear come from notifications with user_id 1, 10, 11, 21 and other user_id containing the number 1.
      if(user_id){
        where[Op.and].push({
          user_id: {
            [Op.eq]: user_id
          }
        })
      }
      //
      //like doesn't work for columns with boolean values, so we add a new condition to the where array.
      if(is_read){
        where[Op.and].push({
          is_read: {
            [Op.eq]: is_read
          }
        })
      }

      const notifications = await Notification.findAndCountAll({ 
        where,
        offset,
        limit
      });

      const totalRows = notifications.count;
      const TotalPage = Math.ceil(totalRows / limit);

      if (!notifications.rows.length) {
        return res.status(400).json({
          status: false,
          message: "no notification found",
          data: notifications,
        });
      }

      return res.status(200).json({
        status: true,
        message: "success get all notification",
        totalrows : totalRows,
        totalpage : TotalPage,
        data: notifications.rows,
      });
    } catch (error) {
      next(error);
    }
  }
};
