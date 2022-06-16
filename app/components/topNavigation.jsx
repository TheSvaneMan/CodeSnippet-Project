import { Link, Form } from "remix";

export default function Navigation({ networkState }) {

    return (
        <div id="nav-links" className='grid grid-cols-2 '>
            <div id="header-user-toolbar-main" className='grid grid-cols-1'>
                <Link to="/" className="hover:text-orange-400 text-neutral-50 text-4xl">
                    KeepSnip
                </Link>
                <Link to="/snippets/seed" className="hover:text-neutral-50 text-orange-400">
                    Default snippets
                </Link>
            </div>
            <div id="header-user-toolbar" className='grid grid-cols-1 justify-items-end '>
               
                {networkState === 'online' ? <div id="nav-online">
                    <Link to="/profile">
                        Profile
                    </Link>
                    <Form method="post" action="/logout">
                        <button type="submit"
                            className="hover:text-neutral-50 text-orange-400">
                            Log out
                        </button>
                    </Form><Link to="/snippets/new" className="hover:text-neutral-50 text-orange-400">
                        New code snippet
                    </Link>
                </div> : <div id="nav-offline">
                    <p className="hover:text-neutral-50 text-red-600">
                        Log out
                    </p>
                    <p className="hover:text-neutral-50 text-red-600">
                        New code snippet
                    </p>
                </div>}
            </div>
        </div>
    )
}