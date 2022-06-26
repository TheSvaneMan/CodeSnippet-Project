import { Link } from 'remix';

export default function SnippetsNavButton({ setIsNavOpen }) {
    return (
        <Link
            to="/snippets"
            className="border-b border-orange-400 my-2 uppercase"
            onClick={() => {
                setIsNavOpen(false);
            }}
        >
            Snippets
        </Link>
    )
}