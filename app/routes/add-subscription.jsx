import { json } from "@remix-run/node";
// Importing from .server is fine, but the compiler must be 100% sure
// it's only used in the action.
import connectDb from "~/db/connectDb.server";
import { getSession } from "~/sessions.server";
import { sendNativePush } from "~/utils/push.server";

export async function action({ request }) {
  // All these calls are server-side only
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const userID = session.get("userID");
  const subscriptionBody = await request.json();

  if (!subscriptionBody || !subscriptionBody.endpoint) {
    return json({ errorMessage: "Invalid payload" }, { status: 400 });
  }

  try {
    await db.models.subscription.findOneAndUpdate(
      { userID: userID },
      { userID, data: subscriptionBody, updatedAt: new Date() },
      { upsert: true }
    );

    await sendNativePush(subscriptionBody, {
      title: "KeepSnip Subscribed",
      options: { body: "Notifications are now active!" },
    });

    return json({ message: "Success", code: 200 });
  } catch (error) {
    return json({ errorMessage: "Server Error" }, { status: 500 });
  }
}

// Ensure you have a default export (even if it's empty)
// so Remix doesn't think this is a pure server-resource route
export default function AddSubscription() {
  return null;
}
