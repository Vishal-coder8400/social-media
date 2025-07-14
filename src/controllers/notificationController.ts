import { Request, Response } from "express";
import Notification from "../models/notificationModel";
import { AuthRequest } from "./authController";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

// Get Grouped Notifications with Relative Time
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    const notifications = await Notification.find({ receiverId: userId })
      .sort({ createdAt: -1 })
      .populate("senderId", "name photoURL");

    const grouped: Record<string, any[]> = {};

    notifications.forEach(notification => {
      const createdAt = dayjs(notification.createdAt);
      let groupLabel = "";

      if (createdAt.isToday()) {
        groupLabel = "Today";
      } else if (createdAt.isYesterday()) {
        groupLabel = "Yesterday";
      } else {
        groupLabel = createdAt.format("DD MMM YYYY"); // e.g., "05 Jul 2025"
      }

      if (!grouped[groupLabel]) {
        grouped[groupLabel] = [];
      }

      //Safe casting of senderId (populated user object)
      const sender = notification.senderId as unknown as {
        _id: string;
        name: string;
        photoURL: string;
      };

      grouped[groupLabel].push({
        _id: notification._id,
        type: notification.type,
        postId: notification.postId,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        timeAgo: createdAt.fromNow(), // e.g., "4 hours ago"
        senderId: {
          _id: sender._id,
          name: sender.name,
          photoURL: sender.photoURL,
        },
      });
    });

    res.status(200).json({ notifications: grouped });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications", error });
  }
};

//Mark Single Notification as Read
export const markAsRead = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark as read", error });
  }
};
