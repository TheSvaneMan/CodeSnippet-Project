console.log('Hello from push notification service');
import vapidConfig from '../../config.json' assert {type: 'json'};

const VAPID_PUBLIC_KEY = vapidConfig.PUBLIC_KEY.toString();

async function postToServer(url, data) {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response;
} 

export async function subscribeToPush() {
    const registration = await navigator.serviceWorker.getRegistration();
    // ServiceWorkerRegistration object whose scope URL matches the provided client URL.
    const subscription = await registration.pushManager.subscribe({
    // It returns a Promise that resolves to a PushSubscription object containing details of a push subscription.
        userVisibleOnly: true,
        // A boolean indicating that the returned push subscription will only be used for messages whose effect is made visible to the user.
        applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY)
        // The applicationServerKey read-only property of the PushSubscriptionOptions interface contains the public key used by the push server.
        // It's basically a security measure that prevents anyone else sending messages to an application's users.
    });
    await postToServer('/add-subscription', subscription);
    console.log("Subscribed to Push Notifications");
    let response = {
        status: 200,
        message: 'Subscribed to Push Notifications'
    }
    return response;
}

export async function unsubscribeFromPush() {
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
        postToServer('/remove-subscription', {
            endpoint: subscription.endpoint
        });
        await subscription.unsubscribe();
        let response = {
            status: 200,
            message: 'Unsubscribed from Push Notifications'
        }
        return response;
    } else {
        let response = {
            status: 200,
            message: 'No push notification subscription found'
        }
        return response;
    }
    
}

export async function notifyMe() {
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration.pushManager.getSubscription();
    postToServer('/notify-me', { endpoint: subscription.endpoint });
}

async function notifyAll() {
    const response = await fetch('/notify-all', {
        method: 'POST'
    });
    if (response.status === 409) {
        document.getElementById('notification-status-message').textContent = 'There are no subscribed endpoints to send messages to, yet';
    }
}

// Utility functions
export const urlB64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


