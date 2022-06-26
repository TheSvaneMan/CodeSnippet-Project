import { Link } from 'remix';

export default function NewSnippetNavButton({ networkState, networkStateUpdate, setIsNavOpen, navigate }) {
    return (<>
        {networkState === "online" ? (
            <button
                type="button"
                onClick={() => {
                    networkStateUpdate();
                    if (navigator.onLine) {
                        console.log("online");
                        setIsNavOpen(false);
                        // Checking if the snippets are visible, if they are then clicking "Show snippets" button
                        if (document.getElementById("showSnippsCheck")) {
                            const checkbox =
                                document.getElementById("showSnippsCheck").checked;
                            if (checkbox === false) {
                                document.getElementById("showSnippsCheck").click();
                                console.log("snippets hidden");
                            }
                        }
                        return navigate("/snippets/new");
                    }
                }}
                className="border-b border-orange-400 my-2 uppercase"
            >
                New code snippet
            </button>
        ) : (
            <button
                className="border-b border-red-600 text-red-600 my-2 uppercase"
                onClick={() => {
                    networkStateUpdate();
                }}
            >
                New code snippet
            </button>
        )}
    </>)
}