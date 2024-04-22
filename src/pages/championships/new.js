import { get } from "@/utils/api";
import { useEffect, useState } from "react";
import { post } from "@/utils/api";
import { useRouter } from "next/router";

export default function Championships() {
    const router = useRouter();
    const [type, setType] = useState(null)
    const [name, setName] = useState(null)
    const [players, setPlayers] = useState([])

    const fetchPlayers = async () => {
        try{
            const response = await get('/championship/players');
            console.log('response', response)
            setPlayers(response.players)
        } catch(error) {
            if(error.message == 401) {
                logout();
            }
        }
    }

    useEffect(() => {
        fetchPlayers()
        setType(localStorage.getItem('type'))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const object = {
            name,
            players: players
        }
        console.log('object', object)
        const response = await post('/championship', object);
        console.log('response', response)
        router.push('/championships')
    }

    return (
      <div>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Championship Name</label>
                <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Championship Name"/>
            </div>
            <div>
                <label htmlFor="players">Players</label>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            players?.length && players.map((player) => (
                                <tr key={player._id}>
                                    <td>{player.name}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            <button type="submit">Send Invite</button>
        </form>
      </div>
    );
}