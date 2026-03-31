// app/routes/profile.jsx
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState } from "react";
import connectDb from "~/db/connectDb.server";
import { getSession, requireUserSession } from "~/sessions.server";

// Import your existing push notification service functions
import {
  subscribeToPush,
  unsubscribeFromPush,
  notifyMe,
} from "~/pushNotifications/push-notification-service.client.js";

// Material 3 Web Components
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/icon/icon.js";
import "@material/web/elevation/elevation.js";

export async function loader({ request }) {
  await requireUserSession(request);
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const userID = session.get("userID");

  // Security: Only fetch the fields we actually need, NEVER send the password hash to the client
  const user = await db.models.user
    .findById(userID)
    .select("username _id")
    .lean();

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return json(user, {
    headers: {
      "cache-control": "private, max-age=604800, stale-while-revalidate=86400",
    },
  });
}

export default function Profile() {
  const user = useLoaderData();
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  // Safe UI Feedback Handler
  const showStatus = (text, type = "default") => {
    setStatusMessage({ text, type });
    // Auto-clear message after 5 seconds
    setTimeout(() => setStatusMessage({ text: "", type: "" }), 5000);
  };

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === "denied") {
        showStatus(
          "Permission denied. Please enable notifications in your browser settings.",
          "error"
        );
        return;
      }
      if (permission === "granted") {
        const response = await subscribeToPush();
        showStatus(response.message, "success");
      }
    } catch (error) {
      console.error(error);
      showStatus("Failed to subscribe to notifications.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsProcessing(true);
    try {
      const response = await unsubscribeFromPush();
      showStatus(response.message, "success");
    } catch (error) {
      console.error(error);
      showStatus("Failed to unsubscribe.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestNotification = async () => {
    setIsProcessing(true);
    try {
      await notifyMe();
      showStatus("Test notification sent! Check your device.", "success");
    } catch (error) {
      console.error(error);
      showStatus("Failed to send test notification.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex justify-center p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="w-full max-w-2xl relative flex flex-col gap-8 p-8 rounded-[28px] bg-surface-container-high shadow-sm">
        <md-elevation></md-elevation>

        {/* Profile Header */}
        <div className="flex items-center gap-6 pb-6 border-b border-outline-variant">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary-container text-on-primary-container">
            <md-icon className="text-4xl">person</md-icon>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-on-surface">
              Hey, {user.username}!
            </h1>
            <p className="text-on-surface-variant mt-1">
              Manage your account settings
            </p>
          </div>
        </div>

        {/* Notifications Settings Panel */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <md-icon className="text-primary">notifications</md-icon>
            <h2 className="text-xl font-semibold text-on-surface">
              Push Notifications
            </h2>
          </div>
          <p className="text-sm text-on-surface-variant mb-2">
            Stay updated with alerts directly to your device. Note: Your browser
            must support Web Push.
          </p>

          {/* Status Message Banner */}
          {statusMessage.text && (
            <div
              className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                statusMessage.type === "error"
                  ? "bg-error-container text-on-error-container"
                  : "bg-secondary-container text-on-secondary-container"
              }`}
            >
              <md-icon>
                {statusMessage.type === "error" ? "error" : "check_circle"}
              </md-icon>
              {statusMessage.text}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-2">
            <md-filled-button onClick={handleSubscribe} disabled={isProcessing}>
              <md-icon slot="icon">notifications_active</md-icon>
              Subscribe
            </md-filled-button>

            <md-outlined-button
              onClick={handleTestNotification}
              disabled={isProcessing}
            >
              <md-icon slot="icon">send</md-icon>
              Test Notification
            </md-outlined-button>

            <md-outlined-button
              onClick={handleUnsubscribe}
              disabled={isProcessing}
              className="sm:ml-auto"
              style={{
                "--md-outlined-button-label-text-color":
                  "var(--md-sys-color-error)",
                "--md-outlined-button-outline-color":
                  "var(--md-sys-color-error)",
              }}
            >
              <md-icon slot="icon">notifications_off</md-icon>
              Unsubscribe
            </md-outlined-button>
          </div>
        </div>
      </div>
    </div>
  );
}
