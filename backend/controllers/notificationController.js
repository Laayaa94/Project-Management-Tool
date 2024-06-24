const Notification = require('../models/Notification');

const createNotification = async (userId, message, type, taskId) => {
  try {
    const notification = new Notification({
      userId,
      message,
      type,
      taskId
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming authenticated user ID is available in req.user._id
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const deletedNotification = await Notification.findByIdAndDelete(notificationId);
    if (!deletedNotification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Error deleting notification' });
  }
};

module.exports = {
  createNotification,
  getMyNotifications,
  deleteNotification,
};
