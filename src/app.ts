// src/app.ts
import express from "express";
import AuthRoutes from "./routes/authRoutes"; 
import postRoutes from "./routes/postRoutes"; 
import commnetRoute from "./routes/commentRoutes"
import notificationRoutes from "./routes/notification";
import dailyMessageRoutes from "./routes/dailyMessageRoutes";
import whatsappRoutes from "./routes/whatsappOTPRoute";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

//all routes 
app.use("/api/auth",AuthRoutes);

app.use("/api/post",postRoutes);

app.use("/api/comment",commnetRoute);

// notification
app.use("/api/notifications", notificationRoutes);
app.use("/api/daily-message", dailyMessageRoutes);

// whatsapp OTP
app.use("/api/whatsapp", whatsappRoutes);



export default app;
