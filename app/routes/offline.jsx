export async function loader({ request }) {
    console.log("Offline backup page for our application");
    return null;
}

export default function OfflinePage() {
    return (
        <div id="Offline-Page">
            <h1>
                Sorry, seems like you are trying to access a page or data you haven't rendered before, therefore our application cannot display it.
            </h1>
            <h2>
                Please try reconnecting to the internet to resume your work.
            </h2>
        </div>
    )
}

export function ErrorBoundary({ error }) {
    return (
        <div className='grid grid-cols-1 lg:col-span-3 bg-neutral-900 p-4 rounded-lg shadow-lg mx-5 space-y-10'>
            <h3>Offline Page</h3>
            <div className='px-10 animate-pulse transition delay-300'>
                <h2>
                    The application was unable to handle that request because..
                </h2>
                <p className="text-white font-bold">
                    {error.name}: {error.message}
                </p>
                <h4>
                    Try checking your network connection or reload the page.
                </h4>
            </div>
            <Link to="/" className="py-1 px-4 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Try clicking on another snippet</Link>
        </div>
    );
}