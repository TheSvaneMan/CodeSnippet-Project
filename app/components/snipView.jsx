export default function SnipView({ snip }) {
    return (
        <div id="Snippet-Data" className='grid grid-cols-1 space-y-2 mb-5'>
            <h1 className="text-2xl font-bold mb-2">{snip.title}</h1>
            <h1>
                <b>Date:</b> {snip.date}
            </h1>
            <h1>
                <b>Language:</b> {snip.language}
            </h1>
            <h1>
                <b>Description:</b> {snip.description}
            </h1>
            <div id="Code-block" className='grid grid-cols-1 space-y-4'>
                <b>Code:</b>
                <code className='text-black bg-slate-100 p-2 rounded-lg'>
                    {snip.code}
                </code>
            </div>
            <h1>
                <b>Favorite:</b> {snip.favorite ? 'Yes' : 'No'}
            </h1>
            <p>
                <b>Privacy: </b> {snip.shareable ? 'Public' : 'Private'}
            </p>
        </div>
    )
}