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
        await db.models.subscription.deleteOne({ userID: userID }, { data: null });
        console.log("Subscription removed");
        let message = {
            message: "Subscription removed",
            code: 200
        }
        return json(message);
    } catch (error) {
        return json(
            { errorMessage: "Error deleting subscription!" },
            { status: 400 }
        );
    }
};