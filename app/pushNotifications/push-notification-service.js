import { json } from 'remix';

console.log('Hello from push notification service');

const VAPID_PUBLIC_KEY = "BBMfqa-KsxYs6cAy5mTSt3laiCnvS1L1KTdnWRCW6kTKk2_FeJIIFBzYQQIhBX4awRFmi9-3MsGOLtaYcVsX8kU";

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
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY)
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


