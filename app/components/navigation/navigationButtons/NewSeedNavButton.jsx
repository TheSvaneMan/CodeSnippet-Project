import { Link } from 'remix';

export default function NewSeedNavButton({ networkState, networkStateUpdate, setIsNavOpen, navigate }) {
    return (
        <>
            {networkState === "online" ? (
                <button
                    type="button"
                    onClick={() => {
                        networkStateUpdate();
                        if (navigator.onLine) {
                            setIsNavOpen(false);
                            // Checking if the snippets are visible, if they are then clicking "Show snippets" button
                            if (document.getElementById("showSnippsCheck")) {
                                const checkbox = document.getElementById("showSnippsCheck").checked;
                                if (checkbox === false) {
                                    document.getElementById("showSnippsCheck").click();
                                }
                            }
                            return navigate("/snippets/seed");
                        }
                    }}
                    className="border-b border-orange-400 my-2 uppercase"
                >
                    Default snippets
                </button>
            ) : (
                <button
                    className="border-b border-red-600 text-red-600 my-2 uppercase"
                    onClick={() => {
                        networkStateUpdate();
                    }}
                >
                    Default snippets
                </button>
            )}</>
    )
}