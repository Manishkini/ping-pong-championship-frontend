import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { get } from "@/utils/api";
import { socket } from "@/utils/socket";
import { Button, Table, Tag } from "antd";

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
                if(error.message == 401) {
                    logout();
                }
          }
    }

    useEffect(() => {
        if(championshipId) {
            fetchGames(championshipId)
            socket.on(`${championshipId}`, (data) => {
                fetchGames(championshipId);
            })
        }

        return () => {
            socket.removeListener(`${championshipId}`)
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
                record.status === "Started" && 
                <Button type={record.Winner ? '' : 'primary'} onClick={() => router.push(`/championships/${championshipId}/games/${record._id}`)}>
                    { record.Winner ? `View` : `Join`}
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Table columns={columns} dataSource={games} />
            {/* <table>
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
                                    <td>
                                        {
                                            game.status === "Started" && <button onClick={() => router.push(`/championships/${championshipId}/games/${game._id}`)}>Join</button>
                                        }
                                    </td>
                                </tr>
                            ))
                        : null
                    }
                </tbody>
            </table> */}
        </div>
    )
}

export default Games;