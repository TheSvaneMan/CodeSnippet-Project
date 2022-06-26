import { Link } from 'remix';

export default function ToggleThemeNavButton({ themeChange }) {
    return (
        <button
            className="border-b border-orange-400 my-2 uppercase"
            onClick={() => themeChange()}
        >
            Light / Dark
        </button>
    )
}