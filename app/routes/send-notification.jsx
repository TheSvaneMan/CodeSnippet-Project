import { json } from "@remix-run/node";
import { sendNativePush } from "~/utils/push.server";

export async function action({ request }) {
  const subscriptionEndPoint = await request.json();

  // Log for debugging
  console.log("Pushing to endpoint:", subscriptionEndPoint?.endpoint);

  try {
    // We pass it as an array to maintain your original logic flow
    await sendNotifications([subscriptionEndPoint]);

    return json({
      message: "Notification sent successfully",
      code: 200,
    });
  } catch (error) {
    console.error("Action Error:", error);
    return json(
      { errorMessage: "Error sending notification!" },
      { status: 400 }
    );
  }
}

/**
 * Native implementation of your notification broadcaster
 */
async function sendNotifications(subscriptions) {
  const notificationPayload = {
    title: "Hello, Notifications!",
    options: {
      body: `ID: ${Math.floor(Math.random() * 100)}`,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
    },
  };

  // We use a for...of loop so we can properly await the native calls
  // forEach doesn't work well with async/await!
  for (const subscription of subscriptions) {
    if (!subscription?.endpoint) continue;

    const endpoint = subscription.endpoint;
    const id = endpoint.substring(endpoint.length - 8);

    try {
      console.log(`Sending native push to ID: ${id}`);
      const result = await sendNativePush(subscription, notificationPayload);
      console.log(`✅ Result: ${result.status}`);
    } catch (error) {
      console.error(`❌ Failed for ID ${id}:`, error.message);
      // We don't throw here so one failed subscription doesn't stop the whole loop
    }
  }
}

export async function loader() {
  return null;
}
