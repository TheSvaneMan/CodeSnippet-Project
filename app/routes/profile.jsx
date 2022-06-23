import { getSession, requireUserSession } from '~/sessions.server';
// Push Notification Service
import { subscribeToPush, unsubscribeFromPush, notifyMe } from '../pushNotifications/push-notification-service';
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

// This check is !important
if (typeof document === "undefined") {
    // running in a server environment
} else {
    // const subscribeButton = document.getElementById('subscribe');
    // const unsubscribeButton = document.getElementById('unsubscribe');
    // const notifyMeButton = document.getElementById('notify-me');  
}

async function subscribeButtonHandler() {
    const result = await Notification.requestPermission();
    if (result === 'denied') {
        console.error('The user explicitly denied the permission request.');
        return;
    }
    if (result === 'granted') {
        console.info('The user accepted the permission request.');
        let response = await subscribeToPush();
        alert(response.message);
    }
}

async function unsubscribeButtonHandler() {
    let response = await unsubscribeFromPush();
    alert(response.message);
}

export default function Profile() {
    const user = useLoaderData();

    return (
        <div id="Profile-page">
            <div id="Profile-banner" className='grid grid-cols-1 justify-items-center my-10 gap-4'>
                <h1 className='text-xl'>
                   Hey {user.username}!
                </h1>
                <div id="profile-notifications" className='grid grid-cols-1 gap-4'>
                    <button id="subscribe" onClick={subscribeToPush} className="mt-3 mb-2 py-1 px-3 border-2 
                  border-orange-400 bg-neutral-50 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-50 rounded-3xl
                  hover:bg-orange-400" >
                        Subscribe to push notifications
                    </button>
                    <button id="unsubscribe" onClick={unsubscribeButtonHandler} className="mt-3 mb-2 py-1 px-3 border-2 
                  border-orange-400 bg-neutral-50 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-50 rounded-3xl
                  hover:bg-orange-400">
                        Unsubscribe from push notifications
                    </button>
                    <button id='notify-me' onClick={notifyMe} className="mt-3 mb-2 py-1 px-3 border-2 
                  border-orange-400 bg-neutral-50 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-50 rounded-3xl
                  hover:bg-orange-400" >
                        Notify Me
                    </button>
                    <button id="notify-all" className="mt-3 mb-2 py-1 px-3 border-2 
                  border-orange-400 bg-neutral-50 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-50 rounded-3xl
                  hover:bg-orange-400">
                        Notify All
                    </button>
                </div>
            </div>
        </div>
    )
}