import Link from 'next/link';

const RefereeViewChampionship = ({ championships }) => {
    return (
        <div>
            <section className="flex flex-row h-16 w-full gap-1 border-b-2 border-neutral-900">
                <div className="w-full">
                    <div className="flex flex-row justify-center items-center h-16 mr-20 gap-4">
                        <button className="add-buttons">
                            <Link href="/championships/new">Add Championships</Link>
                        </button>
                    </div>
                </div>
            </section>
            <section className='grid grid-cols-4 gap-4'>
                {
                    championships?.length 
                    ?   championships.map((obj) => (
                            <div className='w-48 h-48 bg-slate-400 text-center' key={obj._id}>
                                <div className=''>{obj.name}</div>
                                <div className=''>{`Status: ${obj.status}`}</div>
                                <button className="add-buttons">
                                    <Link href={`/championships/${obj._id}`}>Enter</Link>
                                </button>
                            </div>
                        ))
                    :   null
                }
            </section>
        </div>
    )
}

export default RefereeViewChampionship;