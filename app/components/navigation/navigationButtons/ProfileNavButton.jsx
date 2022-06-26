import {Link} from 'remix';

export default function ProfileNavButton({ networkStateUpdate, setIsNavOpen, navigate}) {
    return (
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
                            }
                        }
                        return navigate("/profile");
                    }
                }}
                className="border-b border-orange-400 my-2 uppercase"
            >
                Profile
            </button>
    )
}