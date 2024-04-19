import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { get } from "@/utils/api";
import { socket } from "@/utils/socket";

const Games = () => {
    const router = useRouter();
    const { championshipId } = router.query;

    const [games, setGames] = useState([])

    const fetchGames = async (championshipId) => {
        try{
            const response = await get(`/championship/${championshipId}/games`);
            console.log('response', response)
            setGames(response.games)
          } catch(error) {
              console.log('error', error)
          }
    }

    useEffect(() => {
        if(championshipId) {
            fetchGames(championshipId)
        }
    }, [championshipId])

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Round Number</th>
                        <th>Game Type</th>
                        <th>First Player</th>
                        <th>Second Player</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        games?.length
                        ?   games.map((game) => (
                                <tr key={game._id}>
                                    <td>{game.game_round_number}</td>
                                    <td>{game.game_type}</td>
                                    <td>{game.first_player.name}</td>
                                    <td>{game.second_player.name}</td>
                                    <td><button onClick={() => router.push(`/championships/${championshipId}/games/${game._id}`)}>Join</button></td>
                                </tr>
                            ))
                        : null
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Games;