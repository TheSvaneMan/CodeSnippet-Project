import { json } from 'remix';
import { webpush } from 'web-push';

const vapidDetails = {
    publicKey: [process.env.VAPID_PUBLIC_KEY],
    privateKey: [process.env.VAPID_PRIVATE_KEY],
    subject: [process.env.VAPID_SUBJECT]
};

export async function action({ request }) {
    const subscriptionEndPoint = await request.json();
    console.log(subscriptionEndPoint);
    // Push and save data to mongodb for subscription service
    try {
        sendNotifications([subscriptionEndPoint]);
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
        TTL: 10000,
        vapidDetails: vapidDetails
    };
    // Send a push message to each client specified in the subscriptions array.
    subscriptions.forEach(subscription => {
        const endpoint = subscription.endpoint;
        console.log("Subscription : " + subscription.endpoint);
        const id = endpoint.substr((endpoint.length - 8), endpoint.length);
        webpush.sendNotification(subscription, notification, options)
            .then(result => {
                console.log(`Endpoint ID: ${id}`);
                console.log(`Result: ${result.statusCode}`);
            })
            .catch(error => {
                console.log(`Endpoint ID: ${id}`);
                console.log(`Error: ${error} `);
            });
    });
}
