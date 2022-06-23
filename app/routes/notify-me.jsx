import { json } from 'remix';
import connectDb from '~/db/connectDb.server';
import { requireUserSession, getSession } from "~/sessions.server";
import webpush from 'web-push';


const vapidDetails = {
    publicKey: [process.env.VAPID_PUBLIC_KEY],
    privateKey: [process.env.VAPID_PRIVATE_KEY],
    subject: [process.env.VAPID_SUBJECT]
};

export async function action({ request }) {
    const subscriptionEndPoint = await request.json();
    // Get the user ID in case - I don't think we need save it but I do anyways
    await requireUserSession(request);
    const db = await connectDb();
    const session = await getSession(request.headers.get("Cookie"));
    const userID = session.get("userID");
    // Push and save data to mongodb for subscription service
    try {
        console.log("Attempting to send notification");
        const userSubscription = await db.models.subscription.findOne({ userID: userID });
        let notificationResponse = await sendNotifications([userSubscription.data]);
        console.log("Notification sent");
        let message = {
            message: "Notification sent",
            code: 200
        }
        return json(message);
    } catch (error) {
        // console.log(error);
        return json(
            { errorMessage: "Error notifying user!" },
            { status: 400 }
        );
    }
};

export async function loader({ request }) {
    return null;
}

function sendNotifications(subscriptions) {
    // Create the notification content.
    const notification = JSON.stringify({
        title: "Hello, Notifications!",
        options: {
            body: `ID: ${Math.floor(Math.random() * 100)}`
        }
    });
    // Customize how the push service should attempt to deliver the push message.
    // And provide authentication information.
    const options = {
        TTL: 60,    
    };
    if (subscriptions.length === 1) {
        const subscription = subscriptions[0];
        const endpoint = subscription.endpoint;
        const id = endpoint.substr((endpoint.length - 8), endpoint.length);
        webpush.setVapidDetails(
            vapidDetails.subject.toString(),
            vapidDetails.publicKey.toString(),
            vapidDetails.privateKey.toString(),
        );
        webpush.sendNotification(subscription, notification, options)
            .then(result => {
                console.log(`Endpoint ID: ${id}`);
                console.log(`Result : ${result.statusCode}`);
            })
            .catch(error => {
                console.log(`Endpoint ID: ${id}`);
                console.log(`Error: ${error} `);
            });
    } else {
        // Send a push message to each client specified in the subscriptions array.
        subscriptions.forEach(subscription => {
            const endpoint = subscription.endpoint;
            const id = endpoint.substr((endpoint.length - 8), endpoint.length);
            webpush.setVapidDetails(
                vapidDetails.subject.toString(),
                vapidDetails.publicKey.toString(),
                vapidDetails.privateKey.toString(),
            );
            webpush.sendNotification(subscription, notification, options)
                .then(result => {
                    console.log(`Endpoint ID: ${id}`);
                    console.log(`Result : ${result.statusCode}`);
                })
                .catch(error => {
                    console.log(`Endpoint ID: ${id}`);
                    console.log(`Error: ${error} `);
                });
        });
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