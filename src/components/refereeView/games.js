import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { get } from "@/utils/api";
import { socket } from "@/utils/socket";
import { Button, Divider, Flex, Table, Tag } from "antd";


const Games = () => {
    const router = useRouter();
    const { championshipId } = router.query;

    const [games, setGames] = useState([])
    const [draw, setDraw] = useState(null)

    const fetchGames = async () => {
        try{
            const response = await get(`/championship/${championshipId}/games`);
            console.log('response', response)
            setGames(response.games)
            let tempGame = null;
            let tempIsDrawAvailable = true;
            for(const game of response.games) {
                if(game.status === "Quarter") {
                    tempGame = 'Semi Final';
                } else if(game.status === "Semi") {
                    tempGame = 'Final';
                } else if(game.status === "Final") {
                    tempGame = null
                }
                if(!game.Winner) {
                    tempIsDrawAvailable = false;
                }
            }
            if(tempIsDrawAvailable && tempGame) {
                setDraw(tempGame);
            }

        } catch(error) {
            if(error.message == 401) {
                logout();
            }
        }
    }

    const startGame = async (game_id) => {
        try{
            const response = await get(`/game/${game_id}/start`);
            console.log('response', response)
            router.push(`/championships/${championshipId}/games/${game_id}`)
        } catch(error) {
            if(error.message == 401) {
                logout();
            }
        }
    }

    const createDraw = async (type) => {
        try{
            const response = await get(`/championship/${championshipId}/draw/${type}`);
            console.log('response', response)
            fetchGames()
        } catch(error) {
            if(error.message == 401) {
                logout();
            }
        }
    }

    useEffect(() => {
        if(championshipId){
            fetchGames(championshipId)
        }
    }, [championshipId])

    const columns = [
        {
          title: 'Round Number',
          dataIndex: 'game_round_number',
          key: 'game_round_number',
        },
        {
          title: 'Game Type',
          dataIndex: 'game_type',
          key: 'game_type',
        },
        {
          title: 'First Player',
          dataIndex: 'first_player',
          key: 'first_player',
          render: (_, { first_player }) => (
            <span>{first_player.name}</span>
          ),
        },
        {
            title: 'Second Player',
            dataIndex: 'second_player',
            key: 'second_player',
            render: (_, { second_player }) => (
              <span>{second_player.name}</span>
            ),
        },
        {
            title: 'Winner',
            dataIndex: 'Winner',
            key: 'Winner',
            render: (_, record) => (
                record?.Winner && <Tag color="green">{record.Winner.name}</Tag>
            ),
        },
        {
            title: 'Loser',
            dataIndex: 'Loser',
            key: 'Loser',
            render: (_, record) => (
                record?.Loser && <Tag color="red">{record.Loser.name}</Tag>
            ),
        },
        {
            title: 'Action',
            render: (_, record) => (
                record.status !== "Started" 
                ?   <Button type="primary" onClick={() => startGame(record._id)}>
                        Start
                    </Button>
                :   <Button onClick={() => router.push(`/championships/${championshipId}/games/${record._id}`)}>
                        { record.Winner ? `View` : `Join`}
                    </Button>
            ),
        },
      ];

    return (
        <div>
            <Flex gap="medium" justify="center" align="center">
                {
                    draw && draw === "Semi Final"
                    ? <Button type="primary" onClick={() => createDraw("semi-final")}>Draw Semi Final</Button>
                    : draw === "Final" && <Button type="primary" onClick={() => createDraw("final")}>Invite Finalist</Button>
                }
            </Flex>
            <Divider>Games</Divider>
            <Table columns={columns} dataSource={games} />
        </div>
    )
}

export default Games;