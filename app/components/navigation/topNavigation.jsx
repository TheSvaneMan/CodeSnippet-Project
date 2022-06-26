import { Link, Form } from "remix";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DesktopMenu from './desktopMenu/DesktopMenu';
import MobileMenu from './mobileMenu/MobileMenu';
import HomeButton from './navigationButtons/HomeButton';

export default function Navigation({
  networkStateUpdate,
  themeChange,
  networkState, 
}) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div id="nav-links" className="grid grid-cols-2 lg:grid-cols-4 ">
      <div id="header-user-toolbar-main" className="grid grid-cols-1">
        <HomeButton networkStateUpdate={networkStateUpdate} navigate={navigate} />
      </div>
      <div
        id="header-user-toolbar"
        className="grid grid-cols-1 lg:col-span-3 justify-items-end "
      >
        <div className="flex items-center justify-between py-3">
          <nav>
            <MobileMenu isNavOpen={isNavOpen} networkState={networkState} networkStateUpdate={networkStateUpdate} themeChange={themeChange} setIsNavOpen={setIsNavOpen} navigate={navigate} />
            <DesktopMenu networkState={networkState} networkStateUpdate={networkStateUpdate} themeChange={themeChange} setIsNavOpen={setIsNavOpen} navigate={navigate} />
          </nav>
          <style>{`
      .showMenuNav {
        display: block;
        position: absolute;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
    `}</style>
        </div>
      </div>
    </div>
  );
}

// Menu Refactorization -- State Aware Components & Component Encapsulation
// State aware modular components - Readability is a bit better now and allows for us to reuse components else where in the application if need be
// fx Mobile and Desktop use the same underlying components/buttons









