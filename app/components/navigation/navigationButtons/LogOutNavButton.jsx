import { Link, Form } from 'remix';

export default function LogOutNavButton({ networkState }) {
    return (
        <Form method="post" action="/logout" name="mobileLogoutForm">
            {networkState === "online" ? (
                <button
                    type="submit"
                    className="border-b border-orange-400 my-2 uppercase"
                >
                    Log out
                </button>
            ) : (
                <button
                    type="button"
                    onClick={() => {
                        networkStateUpdate();
                    }} // this button is showing if youre offline
                    className="border-b border-red-600 text-red-600 my-2 uppercase"
                >
                    Log out
                </button>
            )}
        </Form>
    )
}