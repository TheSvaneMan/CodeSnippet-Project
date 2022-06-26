export default function HomeButton({ networkStateUpdate, navigate }) {
    return (
        <button
            type="button"
            onClick={() => {
                networkStateUpdate();
                if (navigator.onLine) {
                    // Checking if the snippets are visible, if they are not then clicking "Show snippets" button
                    if (document.getElementById("showSnippsCheck")) {
                        const checkbox =
                            document.getElementById("showSnippsCheck").checked;
                        if (checkbox === true) {
                            document.getElementById("showSnippsCheck").click();
                            console.log("checbkox clicked");
                        }
                    }
                    return navigate("/snippets");
                }
            }}
            className="hover:text-orange-400 text-neutral-800 dark:text-neutral-50 text-4xl text-left"
        >
            KeepSnip
        </button>
    )
}