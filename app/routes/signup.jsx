// app/routes/signup.jsx
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useState, useEffect } from "react";
import bcrypt from "bcryptjs";
import connectDb from "~/db/connectDb.server";
import { getSession, commitSession } from "~/sessions.server";

// Material 3 Web Components
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/icon/icon.js";
import "@material/web/elevation/elevation.js";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userID")) {
    return redirect("/snippets");
  }
  return null;
}

export async function action({ request }) {
  const form = await request.formData();
  const username = form.get("username")?.toString().trim();
  const password = form.get("password")?.toString();
  const repeatPassword = form.get("repeatPassword")?.toString();

  const errors = {};

  // 1. Validation
  if (!username || username.length < 3) {
    errors.username = "Username must be at least 3 characters.";
  }

  if (!password || password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (password !== repeatPassword) {
    errors.repeatPassword = "Passwords do not match.";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors, values: { username } }, { status: 400 });
  }

  const db = await connectDb();

  try {
    // 2. Check for existing user
    const existingUser = await db.models.user.findOne({ username });
    if (existingUser) {
      return json(
        {
          errors: { username: "This username is already taken." },
          values: { username },
        },
        { status: 409 }
      );
    }

    // 3. Hash and Create
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.models.user.create({
      username,
      password: hashedPassword,
    });

    // 4. Establish Session
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userID", user._id.toString());

    return redirect("/snippets", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return json(
      { errorMessage: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

export default function SignUp() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [isOnline, setIsOnline] = useState(true);

  // Simple client-side network detection
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-surface p-4">
      <div className="relative w-full max-w-sm p-8 flex flex-col gap-6 rounded-[28px] bg-surface-container-high animate-in fade-in zoom-in-95">
        <md-elevation></md-elevation>

        {/* Header */}
        <div className="text-center">
          <md-icon className="text-5xl text-primary mb-4">person_add</md-icon>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">
            Create Account
          </h1>
          <p className="text-on-surface-variant text-sm">
            Join KeepSnip to save and share code.
          </p>
        </div>

        {/* Offline Warning */}
        {!isOnline && (
          <div className="p-3 rounded-xl bg-error-container text-on-error-container text-sm font-medium flex items-center gap-2">
            <md-icon className="text-base">wifi_off</md-icon>
            You are offline. Connection required.
          </div>
        )}

        {/* Server Error Message (Catch-all) */}
        {actionData?.errorMessage && (
          <div className="p-3 rounded-xl bg-error-container text-on-error-container text-sm font-medium flex items-center gap-2">
            <md-icon className="text-base">error</md-icon>
            {actionData.errorMessage}
          </div>
        )}

        {/* Form */}
        <Form method="post" className="flex flex-col gap-4">
          <md-outlined-text-field
            label="Username"
            name="username"
            required
            autoComplete="username"
            defaultValue={actionData?.values?.username || ""}
            disabled={!isOnline || isSubmitting}
            error={actionData?.errors?.username ? "true" : undefined}
            error-text={actionData?.errors?.username}
          >
            <md-icon slot="leading-icon">person</md-icon>
          </md-outlined-text-field>

          <md-outlined-text-field
            label="Password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            disabled={!isOnline || isSubmitting}
            error={actionData?.errors?.password ? "true" : undefined}
            error-text={actionData?.errors?.password}
          >
            <md-icon slot="leading-icon">lock</md-icon>
          </md-outlined-text-field>

          <md-outlined-text-field
            label="Repeat Password"
            name="repeatPassword"
            type="password"
            required
            autoComplete="new-password"
            disabled={!isOnline || isSubmitting}
            error={actionData?.errors?.repeatPassword ? "true" : undefined}
            error-text={actionData?.errors?.repeatPassword}
          >
            <md-icon slot="leading-icon">lock_reset</md-icon>
          </md-outlined-text-field>

          <div className="mt-4">
            <md-filled-button
              type="submit"
              className="w-full"
              disabled={!isOnline || isSubmitting}
            >
              <md-icon slot="icon">
                {isSubmitting ? "hourglass_empty" : "person_add"}
              </md-icon>
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </md-filled-button>
          </div>
        </Form>

        {/* Footer Link */}
        <div className="text-center mt-2 text-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Log in!
          </Link>
        </div>
      </div>
    </div>
  );
}
