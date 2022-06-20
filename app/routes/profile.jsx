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
    const subscribeButton = document.getElementById('subscribe');
    const unsubscribeButton = document.getElementById('unsubscribe');
    const notifyMeButton = document.getElementById('notify-me');

    async function subscribeButtonHandler() {
        // Prevent the user from clicking the subscribe button multiple times.
        subscribeButton.disabled = true;
        const result = await Notification.requestPermission();
        if (result === 'denied') {
            console.error('The user explicitly denied the permission request.');
            return;
        }
        if (result === 'granted') {
            console.info('The user accepted the permission request.');
        }
        
    }

    async function unsubscribeButtonHandler() {
        // TODO
        const registration = await navigator.serviceWorker.getRegistration();
        const subscription = await registration.pushManager.getSubscription();
        fetch('/remove-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ endpoint: subscription.endpoint })
        });
        const unsubscribed = await subscription.unsubscribe();
        if (unsubscribed) {
            console.info('Successfully unsubscribed from push notifications.');
            unsubscribeButton.disabled = true;
            subscribeButton.disabled = false;
            notifyMeButton.disabled = true;
        }
    }

    document.getElementById('notify-all').addEventListener('click', async () => {
        const response = await fetch('/notify-all', {
            method: 'POST'
        });
        if (response.status === 409) {
            document.getElementById('notification-status-message').textContent =
                'There are no subscribed endpoints to send messages to, yet.';
        }
    });
}

export default function Profile() {
    const user = useLoaderData();
    return (
        <div id="Profile-page">
            <div id="Profile-banner" className='grid grid-cols-1 justify-items-center my-10 gap-4'>
                <h1>
                    {user.username}
                </h1>
                <div id="profile-notifications" className='grid grid-cols-1 gap-4'>
                    <button id="subscribe" onClick={subscribeToPush} className="mt-3 mb-2 pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400" >
                        Subscribe to push notifications
                    </button>
                    <button id="unsubscribe" onClick={unsubscribeFromPush} className="mt-3 mb-2 pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">
                        Unsubscribe from push notifications
                    </button>
                    <button id='notify-me' onClick={notifyMe} className="mt-3 mb-2 pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400" >
                        Notify Me
                    </button>
                    <button id="notify-all" className="mt-3 mb-2 pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">
                        Notify All
                    </button>
                </div>
            </div>
        </div>
    )
}