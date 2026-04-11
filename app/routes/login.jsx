import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useState, useEffect } from "react";
import connectDb from "~/db/connectDb.server";
import { getSession, commitSession } from "~/sessions.server";

// Material 3 Web Components
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/icon/icon.js";
import "@material/web/elevation/elevation.js";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userID")) {
    return redirect("/snippets");
  }
  return json(null, { headers: { "cache-control": "private, max-age=3600" } });
}

export async function action({ request }) {
  const form = await request.formData();
  const username = form.get("username")?.toString().trim();
  const password = form.get("password")?.toString();

  if (!username || !password) {
    return json({ errorMessage: "Both fields are required." }, { status: 400 });
  }

  const db = await connectDb();

  try {
    const user = await db.models.user.findOne({ username });

    if (!user || !(await Bun.password.verify(password, user.password))) {
      return json(
        { errorMessage: "Invalid username or password." },
        { status: 401 }
      );
    }

    // Success: Establish secure session
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userID", user._id.toString());

    return redirect("/snippets", {
      headers: {
        // SECURITY FIX: Setting an explicit expiration date for a signed cookie
        "Set-Cookie": await commitSession(session, {
          expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 7 Days
        }),
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return json({ errorMessage: "Internal server error." }, { status: 500 });
  }
}

export default function Login() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleState = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleState);
    window.addEventListener("offline", handleState);
    return () => {
      window.removeEventListener("online", handleState);
      window.removeEventListener("offline", handleState);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-surface p-4 text-on-surface">
      <div className="relative w-full max-w-sm p-8 flex flex-col gap-6 rounded-[28px] bg-surface-container-high animate-in fade-in zoom-in-95 shadow-lg">
        <md-elevation></md-elevation>

        <div className="text-center">
          <md-icon className="text-5xl text-primary mb-4">
            account_circle
          </md-icon>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-on-surface-variant text-sm">
            Sign in to KeepSnip to continue.
          </p>
        </div>

        {(!isOnline || actionData?.errorMessage) && (
          <div className="p-3 rounded-xl bg-error-container text-on-error-container text-sm font-medium flex items-center gap-2">
            <md-icon className="text-base">
              {!isOnline ? "wifi_off" : "error"}
            </md-icon>
            {!isOnline
              ? "Offline. Connection required."
              : actionData.errorMessage}
          </div>
        )}

        <Form method="post" className="flex flex-col gap-4">
          <md-outlined-text-field
            label="Username"
            name="username"
            required
            autoComplete="username"
            disabled={!isOnline || isSubmitting}
          >
            <md-icon slot="leading-icon">person</md-icon>
          </md-outlined-text-field>

          <md-outlined-text-field
            label="Password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            disabled={!isOnline || isSubmitting}
          >
            <md-icon slot="leading-icon">lock</md-icon>
          </md-outlined-text-field>

          <div className="mt-4">
            <md-filled-button
              type="submit"
              className="w-full"
              disabled={!isOnline || isSubmitting}
            >
              <md-icon slot="icon">
                {isSubmitting ? "hourglass_empty" : "login"}
              </md-icon>
              {isSubmitting ? "Authenticating..." : "Log In"}
            </md-filled-button>
          </div>
        </Form>

        <div className="text-center mt-2 text-sm text-on-surface-variant">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-primary font-medium hover:underline"
          >
            Sign up!
          </Link>
        </div>
      </div>
    </div>
  );
}
