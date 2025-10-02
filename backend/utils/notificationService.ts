// import { TWILIO_AUTH_TOKEN, TWILIO_FROM, TWILIO_SID } from "../config";
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!
const TWILIO_FROM = process.env.TWILIO_FROM!
const TWILIO_SID = process.env.TWILIO_SID!

const twilioClient = (TWILIO_SID && TWILIO_AUTH_TOKEN) ? twilio(TWILIO_SID, TWILIO_AUTH_TOKEN) : null;

export const sendSMS = async (to: string, body: string): Promise<void> => {
    if (!twilioClient || !TWILIO_FROM) {
        console.warn("Twilio not configured — skip sendSMS", to, body);
        return;
    }
    await twilioClient.messages.create({ to, from: TWILIO_FROM, body });
};

export const initiateCall = async (to: string, twiml: string): Promise<void> => {
    if (!twilioClient || !TWILIO_FROM) {
        console.warn("Twilio not configured — skip initiateCall", to);
        return;
    }
    await twilioClient.calls.create({ to, from: TWILIO_FROM, twiml });
};

// Placeholder push function — implement FCM/APNs integration here.
export const sendPushNotification = async (pushToken: string, title: string, body: string, data?: Record<string, string>): Promise<void> => {
    console.log("sendPushNotification stub", { pushToken, title, body, data });
  // Implement FCM/APNs logic here
};
