// Desktop Menu
import CondensedMenu from '../codensedMenu/CondensedMenu';

export default function DesktopMenu({ networkState, networkStateUpdate, themeChange, setIsNavOpen, navigate }) {
    return (
        <ul className="hidden space-x-8 lg:flex">
            <CondensedMenu networkState={networkState} networkStateUpdate={networkStateUpdate} themeChange={themeChange} setIsNavOpen={setIsNavOpen} navigate={navigate} />
        </ul>
    )
}