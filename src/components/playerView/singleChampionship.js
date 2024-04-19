import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { get } from "@/utils/api";
import { socket } from "@/utils/socket";

const SingleChampionshipRefereeView = () => {
    const router = useRouter();
    const { championshipId } = router.query;

    const [name, setName] = useState(null)
    const [status, setStatus] = useState(null)
    const [players, setPlayers] = useState([])

    const fetchSingleChampionship = async (championshipId) => {
      try{
        const response = await get(`/championship/${championshipId}`);
        setName(response.championship.name)
        setStatus(response.championship.status)
        setPlayers(response.championship.players)
        if(checkAllJoined(response.championship.players)) {
            return router.push(`/championships/${championshipId}/games`)
        }
      } catch(error) {
          console.log('error', error)
      }
    }

    const checkAllJoined = (players) => {
        for(const player of players) {
            if(player.status !== "Joined") {
                return false;
            }
        }
        return true;
    }

    useEffect(() => {
      if(championshipId) {
        fetchSingleChampionship(championshipId);
        socket.on(`${championshipId}`, (data) => {
            const tempPlayer = players.map((player) => {
                if(player.player_id === data.player_id) {
                    player.status = data.status;
                }
                return player;
            })
            setPlayers(tempPlayer);
            if(checkAllJoined(tempPlayer)) {
                return router.push(`/championships/${championshipId}/games`)
            }
        })

        return () => {
            socket.removeListener(`${championshipId}`)
        }
      }
    }, [championshipId])

    return (
      <div className="w-full">
        <div className="w-1/3">
          <div className="flex flex-col justify-center">
            <div> 
              <strong>Championship Name :</strong> 
              <span>{name}</span>
            </div>
            <div> 
              <strong>Championship Status :</strong> 
              <span>{status}</span>
            </div>
          </div>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {
                  players?.length && players.map((player) => (
                    <tr key={player.player_id}>
                      <td>{player.player_name}</td>
                      <td>{player.status}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
}

export default SingleChampionshipRefereeView;