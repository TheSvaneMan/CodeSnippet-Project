export default function BurgerMenuButton({ setIsNavOpen }) {
    return (
        <div
            className="space-y-2"
            onClick={() => setIsNavOpen((prev) => !prev)}
        >
            <span className="block h-0.5 w-8 bg-orange-400"></span>
            <span className="block h-0.5 w-8 bg-orange-400"></span>
            <span className="block h-0.5 w-8 bg-orange-400"></span>
        </div>
    )
}