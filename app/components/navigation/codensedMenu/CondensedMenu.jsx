import ProfileNavButton from '../navigationButtons/ProfileNavButton';
import SnippetsNavButton from '../navigationButtons/SnippetsNavButton';
import NewSnippetNavButton from '../navigationButtons/NewSnippetNavButton';
import NewSeedNavButton from '../navigationButtons/NewSeedNavButton';
import ToggleThemeNavButton from '../navigationButtons/ToggleThemeNavButton';
import LogOutNavButton from '../navigationButtons/LogOutNavButton';

export default function CondensedMenu({ networkState, networkStateUpdate, themeChange, setIsNavOpen, navigate }) {
    return (
        <>
            <SnippetsNavButton setIsNavOpen={setIsNavOpen} />
            <NewSnippetNavButton networkState={networkState} networkStateUpdate={networkStateUpdate} setIsNavOpen={setIsNavOpen} navigate={navigate} />
            <NewSeedNavButton networkState={networkState} networkStateUpdate={networkStateUpdate} setIsNavOpen={setIsNavOpen} navigate={navigate} />
            <ToggleThemeNavButton themeChange={themeChange} />
            <ProfileNavButton networkStateUpdate={networkStateUpdate} setIsNavOpen={setIsNavOpen} navigate={navigate} />
            <LogOutNavButton networkState={networkState} />
        </>
    )
}