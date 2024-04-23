import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { get } from "@/utils/api";
import { socket } from "@/utils/socket";
import { Button, Flex, Table } from "antd";

const SingleChampionshipRefereeView = () => {
    const router = useRouter();
    const { championshipId } = router.query;

    const [name, setName] = useState(null)
    const [status, setStatus] = useState(null)
    const [allPlayersJoined, setAllPlayersJoined] = useState(false)
    const [players, setPlayers] = useState([])

    const fetchSingleChampionship = async (championshipId) => {
      try{
        const response = await get(`/championship/${championshipId}`);
        if(response.championship.status === "Started") {
            return router.push(`/championships/${championshipId}/games`)
        }
        setName(response.championship.name)
        setStatus(response.championship.status)
        setPlayers(response.championship.players)
        setAllPlayersJoined(checkAllJoined(response.championship.players))
      } catch(error) {
        if(error.message == 401) {
          logout();
      }
      }
    }

    const handleInvite = async () => {
        try{
            const response = await get(`/championship/${championshipId}/invite`);
            fetchSingleChampionship(championshipId);
        } catch(error) {
          if(error.message == 401) {
            logout();
        }
        }
    }

    const handleStart = async () => {
        try{
            console.log("start")
          const response = await get(`/championship/${championshipId}/start`);
          router.push(`/championships/${championshipId}/games`)
        } catch(error) {
          if(error.message == 401) {
            logout();
          }
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
            setAllPlayersJoined(checkAllJoined(tempPlayer))
        })

        return () => {
            socket.removeListener(`${championshipId}`)
        }
      }
    }, [championshipId])

    const columns = [
      {
        title: 'Player Name',
        dataIndex: 'player_name',
        key: 'player_name',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      },
    ]

    return (
      <div className="w-full">
        <div className="w-1/3 m-auto">
          <div className="flex flex-row justify-around p-10">
            <div> 
              <span>Championship Name :</span> 
              <strong>{name}</strong>
            </div>
            <div> 
              <span>Championship Status :</span> 
              <strong>{status}</strong>
            </div>
          </div>
          <Flex vertical gap="large" align="center" justify="center">
            <Table columns={columns} dataSource={players} pagination={{
              hideOnSinglePage: true
            }} />
            <div>
              {
                  allPlayersJoined
                  ? <Button type="primary" onClick={handleStart}>Start</Button>
                  : <Button type="primary" onClick={handleInvite}>Invite</Button>
              }
            </div>
          </Flex>
        </div>
      </div>
    );
}

export default SingleChampionshipRefereeView;