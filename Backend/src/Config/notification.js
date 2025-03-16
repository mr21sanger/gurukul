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
    let subject = ""


    switch (type) {

        case "OTP_VERIFICATION":
            subject = "Your Gurukul OTP Code";
            message = `Dear User,  
                    
        Your OTP for verification is: **${data.otp}**  
        
        This OTP is valid for **5 minutes**. Do not share it with anyone.  
                    
        Best regards,  
        Gurukul Team`;
            break

        case "TUTOR_VERIFICATION_APPROVED":
            subject = "Verification Approved - Welcome to Gurukul!";
            message = `Dear ${data?.firstName},
    
    Congratulations! Your tutor verification has been successfully approved. You are now eligible to start tutoring on Gurukul.
    
    We are excited to have you onboard and look forward to your valuable contributions in helping students excel.
    
    For any assistance, feel free to reach out to our support team.
    
    Best regards,  
    Gurukul Team`;
            break;



        case "TUTOR_ASSIGNED":
            subject = "A Tutor Has Been Assigned to Your Request";
            message = `Dear ${data.parentName},  
    
    We are pleased to inform you that a tutor has been assigned to your request. Below are the details:  
    
    👨‍🏫 *Tutor Name:* ${data.tutorName}  
    📧 *Email:* ${data.tutorEmail}  
    📞 *Phone:* ${data.tutorPhone}  
    📍 *Address:* ${data.locality}  
    
    Please contact your assigned tutor to coordinate the sessions and begin the learning process.  
    
    If you have any concerns or require assistance, please do not hesitate to contact us.
    
    Best regards,  
    Gurukul Team`;
            break;


        case "TUTOR_ASSIGNMENT_CONFIRMATION":
            subject = "New Student Assigned to You - Gurukul";
            message = `Dear ${data.tutorName},  
    
    We are pleased to inform you that you have been assigned to a new student on Gurukul. Below are the details:  
    
    👩‍🎓 *Student Name:* ${data.parentName}  
    📧 *Email:* ${data.parentEmail}  
    📞 *Phone:* ${data.parentPhone}  
    📍 *Address:* ${data.locality}  
    
    Kindly reach out to the student at your earliest convenience to discuss the session schedule and ensure a smooth learning experience.  
    
    For any queries, feel free to reach out to our support team.  
    
    Best regards,  
    Gurukul Team`;
            break;



        case "NEW_TUTOR_REQUEST":
            subject = "New Tutoring Request Available";
            message = `Hello, Experts!  
    
    A new tutoring request has been received. Below are the details:  
    
    📌 *Order ID:* ${data.orderId}  
    👤 *Preferred Tutor Gender:* ${data.genderPreferred || "Any"}  
    ⏰ *Preferred Time:* ${data.timePreferred || "Flexible"}  
    🏛 *Class Level:* ${data.classLevel}  
    📚 *Subjects:* ${data.subject}  
    ⌛ *Session Duration:* 1 hour/day  
    🗓 *Sessions Per Week:* ${data.availableDays} days  
    💰 *Fee Offered:* ₹${data.fee}/month  
    📍 *Location:* ${data.locality}  
    📞 *Contact:* ${data.phone}  
    
    If you are interested, kindly respond at the earliest.  
    
    Best regards,  
    Gurukul Team  
    🌐 https://gurukul-learn.online/`;
            break;



        case "RESET_PASSWORD":
            subject = "Password Reset Request - Gurukul";
            message = `Dear User,  
    
    We received a request to reset your password. To proceed, please click the link below:  
    
    🔗 ${data.resetLink}  
    
    This link will be valid for the next *one hour*. If you did not request a password reset, please ignore this email or contact our support team.  
    
    Best regards,  
    Gurukul Team`;
            break;

        case "NEW_TUTOR_SIGNUP":
            subject = "New Tutor Signup Alert";
            message = `Dear Admin,  
    
    A new tutor has signed up on Gurukul:  
    
    👤 *Tutor Name:* ${data.tutorName}  
    
    Please review their details and initiate the verification process if necessary.  
    
    Best regards,  
    Gurukul Team`;
            break;

        case "COMPLAINT_SUBMITTED":
            subject = "New Complaint Submitted";
            message = `Dear Admin,  
    
    A new complaint has been submitted by ${data.userName}. Please review and take the necessary action.  
    
    Best regards,  
    Gurukul Team`;
            break;


        case "COMPLAINT_STATUS_UPDATE":
            subject = "Complaint Status Update";
            message = `Dear ${data.userName},  
    
    We would like to inform you that the status of your complaint has been updated:  
    
    📌 *Current Status:* ${data.status}  
    
    If you have any further concerns or need additional assistance, please feel free to contact us.  
    
    Best regards,  
    Gurukul Team`;
            break;

        case "REALTIME_UPDATE":
            subject = "Important Update from Gurukul";
            message = `Dear User,  
    
    We have an important update for you:  
    
    📌 ${data.updateMessage}  
    
    For more details, please log in to your Gurukul account or contact our support team if you have any questions.  
    
    Best regards,  
    Gurukul Team`;
            break;

        default:
            subject = "Notification from Gurukul";
            message = "You have received an important update.";
    }

    // Sending notifications based on the method
    if (method === "email") {
        await sendEmailNotification(data.email, subject, message);
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
