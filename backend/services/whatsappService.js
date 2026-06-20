import axios from "axios";

export const sendWhatsAppMessage = async (
    receiver,
    fullName,
    serialNumber,
    giftAllocated = false
) => {
    try {

        let message = "";

        if (giftAllocated) {

            message = `🏏 *Welcome to JYCC 2.0*
✨ BIGGER • BOLDER • BETTER ✨

Hello *${fullName}*,

We are delighted to confirm your successful registration for JYCC 2.0.

📋 Registration Details
🔹 Registration Number: *${serialNumber}*
🔹 Registered Mobile: *${receiver}*

🎉 *Congratulations!*

You are among the *FIRST 50 REGISTERED PLAYERS* and are eligible for our *Special Gift Offer* 🎁

Please keep your Registration Number safe as it may be required for gift verification and future tournament communication.

*We look forward to welcoming you to the JYCC family!*

Warm Regards,
*JAIN YOUTH COMMUNITY, BHILAI*
One League • One Spirit • One Jain Family
`;

        } else {

            message = `🏏 *Welcome to JYCC 2.0*
✨ BIGGER • BOLDER • BETTER ✨

Hello *${fullName}*,

We are delighted to confirm your successful registration for JYCC 2.0.

📋 Registration Details
🔹 Registration Number: *${serialNumber}*
🔹 Registered Mobile: *${receiver}*

Thank you for becoming a part of this exciting cricketing journey.

Please keep your Registration Number safe for future communication and tournament-related updates.

*We look forward to welcoming you to the JYCC family!*

Warm Regards,
*JAIN YOUTH COMMUNITY, BHILAI*
One League • One Spirit • One Jain Family`;

        }

        const response = await axios.post(
            process.env.WHATSAPP_API,
            {
                action: "send_whatsapp_message",
                appkey: process.env.WHATSAPP_APP_KEY,
                authkey: process.env.WHATSAPP_AUT_KEY,
                receiver,
                message_body: message
            }
        );

        return response.data;

    } catch (error) {
        console.error(
            "WhatsApp Error:",
            error.response?.data || error.message
        );
    }
};