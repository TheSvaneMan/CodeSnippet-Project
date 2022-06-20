import { json } from 'remix';
import connectDb from '~/db/connectDb.server';
import { requireUserSession, getSession } from "~/sessions.server";

export async function action({ request }) {
    const subscriptionBody = await request.json();
    console.log(subscriptionBody);
    // Get the user ID in case - I don't think we need save it but I do anyways
    await requireUserSession(request);
    const db = await connectDb();
    const session = await getSession(request.headers.get("Cookie"));
    const userID = session.get("userID");
    // Push and save data to mongodb for subscription service
    try {
        await db.models.subscription.create({ userID: userID, data: subscriptionBody });
        console.log("Subscription saved");
        let message = {
            message: "Subscription saved",
            code: 200
        }
        return json(message);
    } catch (error) {
        return json(
            { errorMessage: "Error creating subscription!" },
            { status: 400 }
        );
    }
};