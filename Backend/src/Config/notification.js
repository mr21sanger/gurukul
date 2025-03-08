const nodemailer = require("nodemailer");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();


// Email transporter setup (configure with your email credentials)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // Use 465 for SSL, 587 for TLS
    secure: true, // Use true for 465, false for 587
    auth: {
        user: process.env.From_Gmail,
        pass: process.env.Passkey, // Use an App Password if 2FA is enabled
    }
});

const sendNotification = async (type, data, method) => {
    let message = "";
    let sub = ""

    switch (type) {
        case "TUTOR_VERIFICATION_APPROVED":
            message = `Dear ${data?.firstName},\n\nCongratulations! Your verification has been approved. You can now start tutoring on Gurukul.\n\nBest regards,\nGurukul Team`;
            sub = "Verification Approved";

            break;
        case "TUTOR_VERIFICATION_REJECTED":
            message = `Dear ${data?.firstName},\n\nUnfortunately, your verification request has been rejected. Please review your submitted documents and try again after a week.\n\nBest regards,\nGurukul Team`;
            sub = "Verification Rejected";

            break;

        case "TUTOR_ASSIGNED":

            message = `A tutor has been assigned to your request! Tutor: ${data.tutorName}`;
            break;

        case "NEW_TUTOR_REQUEST":
            const { orderId, genderPreferred, timePreferred, classLevel, subject, availableDays, fee, locality, phone } = data
            message = `*Hello! Experts,*  
            😎 *Order ID:* ${orderId}  
            🙋 *Gender Preferred:* ${genderPreferred || "Any"}  
            ⏰ *Time Preferred:* ${timePreferred || "Flexible"}  
            🏛 *Class:* ${classLevel}  
            📚 *Subject(s):* ${subject}  
            ⌛ *Duration:* 1 hr/day  
            🗓 *Session(s):* ${availableDays} days/week  
            💴 *Fee:* ₹ ${fee}/month  
            📍 *Locality:* ${locality}  

             _"Looking forward to a mutually beneficial relationship ❤ always."_  

            *With best,*  
            *Gurukul Tutors*  
            *Faridabad*  
            📳: ${phone}  
            🌐: www.gurukul.com  
        `;
            break;

        case "RESET_PASSWORD":
            const { resetLink } = data
            message = `You requested a password reset. Click the link below to reset your password:  

${resetLink}  

This link is valid for 1 hour. If you did not request this, please ignore this email.`;
            sub = "Reset Your Password";
            break;

        case "NEW_TUTOR_SIGNUP":
            message = `A new tutor has signed up: ${data.tutorName}.`;
            break;

        case "COMPLAINT_SUBMITTED":
            message = `A new complaint has been submitted by ${data.userName}.`;
            break;

        case "COMPLAINT_STATUS_UPDATE":
            message = `Your complaint status has been updated: ${data.status} `;
            break;

        case "REALTIME_UPDATE":
            message = `Real - time update: ${data.updateMessage} `;
            break;

        default:
            message = "Unknown notification type.";
    }

    // Sending notifications based on the method
    if (method === "email") {
        await sendEmailNotification(data.email, sub, message);
    } else if (method === "telegram") {
        await sendTelegramNotification(process.env.TELEGRAM_CHAT_ID, process.env.TELEGRAM_BOT_TOKEN, message);
    } else if (method === "in-app") {
        await storeInAppNotification(data.userId, message);
    }
    return message;
};

// Function to send email notifications
const sendEmailNotification = async (to, subject, message) => {
    try {
        await transporter.sendMail({
            from: '"Gurukul Support" <gurukulorganisation@gmail.com>',
            to,
            subject,
            text: message
        });
    } catch (error) {
        console.error("Email sending error:", error);
    }
};

// Function to send Telegram notifications
const sendTelegramNotification = async (chatId, token, message) => {
    try {
        const botToken = token;
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        await axios.post(url, { chat_id: chatId, text: message });
    } catch (error) {
        console.error("Telegram sending error:", error);
    }
};

// Function to store in-app notifications (e.g., in database)
const storeInAppNotification = async (userId, message) => {
    console.log(`In-app notification stored for user ${userId}:`, message);
};

module.exports = sendNotification;
