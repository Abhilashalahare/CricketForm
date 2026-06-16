import axios from "axios";

export const sendWhatsAppMessage = async (
    receiver,
    fullName,
    serialNumber
) => {
    try {
        const message = `🎉 Welcome to JYCC 2.0!

Hello ${fullName},

Your registration has been successfully completed.

🔹 Registration Number: ${serialNumber}
🔹 Registered Mobile: ${receiver}

Thank you for being a part of JYCC 2.0. We are excited to have you join us for this cricketing journey.

For any future updates, announcements, or verification, please refer to your Registration Number.

🏏 See you at JYCC 2.0!

Regards,
JYCC Organizing Committee
`;

        const response = await axios.post(
            process.env.WHATSAPP_API,
            {
                action: "send_whatsapp_message", // <-- ye change
                receiver,
                message_body: message
            }
        );

        console.log("WhatsApp Sent:", response.data);

        return response.data;

    } catch (error) {
        console.error(
            "WhatsApp Error:",
            error.response?.data || error.message
        );
    }
};