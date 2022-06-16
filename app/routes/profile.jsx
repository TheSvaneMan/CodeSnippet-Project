import { getSession, requireUserSession } from '~/sessions.server';
import connectDb from '~/db/connectDb.server';
import { useLoaderData } from 'remix';

export async function loader({ request }) {
    const db = await connectDb();
    await requireUserSession(request);
    const session = await getSession(request.headers.get("Cookie"));
    const userID = session.get("userID");
    // Returns User 
    const userData = await db.models.user.find({ _id: userID });
    return userData[0];
}

export default function Profile() {
    const user = useLoaderData();

    console.log(user);
    return (
        <div id="Profile-page">
            <div id="Profile-banner">
                <h1>
                    {user.username}
                </h1>
            </div>
        </div>
    )
}