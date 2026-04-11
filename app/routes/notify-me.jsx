import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";
import { requireUserSession } from "~/sessions.server";
import { sendNativePush } from "~/utils/push.server";

export async function action({ request }) {
  const session = await requireUserSession(request);
  const userID = session.get("userID");
  const db = await connectDb();

  try {
    const subscriptionRecord = await db.models.subscription.findOne({ userID });

    if (!subscriptionRecord) {
      return json(
        { errorMessage: "Please enable notifications in your browser first." },
        { status: 404 }
      );
    }

    // Native Notification Content
    const payload = {
      title: "KeepSnip Notification",
      options: {
        body: `Testing native push at ${new Date().toLocaleTimeString()}`,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "test-notification",
      },
    };

    await sendNativePush(subscriptionRecord.data, payload);

    return json({ message: "Sent successfully!" });
  } catch (error) {
    console.error("Native Notification Error:", error);
    return json({ errorMessage: error.message }, { status: 500 });
  }
}
