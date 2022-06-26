import { Link } from "remix";

export default function BottomNavigation() {
    const workingHours = [
        {
            day: "Mon",
            hours: "09:00 - 15:00"
        },
        {
            day: "Tues",
            hours: "09:00 - 17:00"
        },
        {
            day: "Thur",
            hours: "10:00 - 12:00"
        }
    ]
    return (
        <div id="footer" className='grid grid-cols-1 lg:grid-cols-2 text-sm mt-12 pt-4 bottom-0 left-0 right-0 border-t-2 border-orange-400 bg-neutral-100 text-neutral-800 font-sans dark:bg-neutral-800 dark:text-neutral-50'>
            <div className='grid grid-cols-1 gap-4 p-4'>
                <h1 className="text-xl bold">
                    Contact us
                </h1>
                <p>
                    <b>Telephone: </b> 42 69 2020 100
                </p>
                <p>
                    <b>email: </b>developer@keepsnipp.com
                </p>
                <b>
                    Customer Service hours:
                </b>
                <ul className='text-sm'>
                    {workingHours.map((open, i) => {
                        return (
                            <li key={i}>
                                {open.day} : {open.hours}
                            </li>
                        )
                    })}
                </ul>

            </div>
            <div className='grid grid-cols-1 gap-4 p-4'>
                <h1 className="text-xl bold">
                    KeepSnipp
                </h1>
                <Link to="/signup" className="hover:underline bold" >
                    Create an Account for Free!
                </Link>
                <Link to="/login" className="hover:underline bold" >
                    Login
                </Link>
                <Link to="/snippets" className="hover:underline bold" >
                    Snippets
                </Link>
                <Link to="/profile" className="hover:underline bold" >
                    Profile
                </Link>
            </div>
        </div>
    )
}