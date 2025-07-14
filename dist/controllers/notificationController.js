"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getNotifications = void 0;
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const dayjs_1 = __importDefault(require("dayjs"));
const relativeTime_1 = __importDefault(require("dayjs/plugin/relativeTime"));
const isToday_1 = __importDefault(require("dayjs/plugin/isToday"));
const isYesterday_1 = __importDefault(require("dayjs/plugin/isYesterday"));
dayjs_1.default.extend(relativeTime_1.default);
dayjs_1.default.extend(isToday_1.default);
dayjs_1.default.extend(isYesterday_1.default);
// Get Grouped Notifications with Relative Time
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const notifications = yield notificationModel_1.default.find({ receiverId: userId })
            .sort({ createdAt: -1 })
            .populate("senderId", "name photoURL");
        const grouped = {};
        notifications.forEach(notification => {
            const createdAt = (0, dayjs_1.default)(notification.createdAt);
            let groupLabel = "";
            if (createdAt.isToday()) {
                groupLabel = "Today";
            }
            else if (createdAt.isYesterday()) {
                groupLabel = "Yesterday";
            }
            else {
                groupLabel = createdAt.format("DD MMM YYYY"); // e.g., "05 Jul 2025"
            }
            if (!grouped[groupLabel]) {
                grouped[groupLabel] = [];
            }
            //Safe casting of senderId (populated user object)
            const sender = notification.senderId;
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
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch notifications", error });
    }
});
exports.getNotifications = getNotifications;
//Mark Single Notification as Read
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield notificationModel_1.default.findByIdAndUpdate(id, { isRead: true });
        res.status(200).json({ message: "Notification marked as read" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to mark as read", error });
    }
});
exports.markAsRead = markAsRead;
