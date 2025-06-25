import axios from "axios";

const fast2SmsApiKey = process.env.FAST2SMS_API_KEY;

export const sendOtp = async (phoneNumber, otp) => {
    const data = {
        route: "dlt",
        sender_id: "ADRIG",
        message: "188762",
        variables_values: otp,
        flash: 0,
        numbers: phoneNumber,
    };

    const config = {
        method: "post",
        url: "https://www.fast2sms.com/dev/bulkV2",
        headers: {
            authorization: fast2SmsApiKey,
            "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        throw error;
    }
};
