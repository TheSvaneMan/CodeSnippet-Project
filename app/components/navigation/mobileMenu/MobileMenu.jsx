import CondensedMenu from '../codensedMenu/CondensedMenu';
import BurgerMenuButton from './bugerMenuButton';

export default function MobileMenu({ isNavOpen, networkState, setIsNavOpen, networkStateUpdate, navigate, themeChange }) {
    return (
        <ul className="flex list-none lg:hidden" >
            <BurgerMenuButton setIsNavOpen={setIsNavOpen} />
            <ul
                className={
                    isNavOpen
                        ? "bg-neutral-100 list-none z-10 min-h-screen text-neutral-800 dark:bg-neutral-800 dark:text-neutral-50 showMenuNav"
                        : "hidden"
                }
            >
                <button className="border-2 w-36 px-4 py-2 text-center
                  border-orange-400 bg-neutral-50 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-50 rounded-3xl
                  hover:bg-orange-400" onClick={() => setIsNavOpen((prev) => !prev)}>
                    Close
                </button>
                <CondensedMenu networkState={networkState} networkStateUpdate={networkStateUpdate} themeChange={themeChange} setIsNavOpen={setIsNavOpen} navigate={navigate} />
            </ul>
        </ul>
        
    )
}