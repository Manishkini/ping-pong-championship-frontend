import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { get } from "@/utils/api";
import { socket } from "@/utils/socket";
import { Avatar, Button, Flex } from "antd";

const SingleGame = () => {
    const router = useRouter();
    const { championshipId, gameId } = router.query;
    console.log('championshipId', championshipId)
    console.log('gameId', gameId)
    const [game, setGame] = useState(null)
    const [lastPoint, setLastPoint] = useState(null)
    const [attackerObj, setAttackerObj] = useState({});
    const [defenseObj, setDefenseObj] = useState({});
    const [buttonEnable, setButtonEnable] = useState(false);
    const [firstPlayerWon, setFirstPlayerWon] = useState(0);
    const [secondPlayerWon, setSecondPlayerWon] = useState(0);

    const fetchGame = async (gameId) => {
        try {
            const response = await get(`/game/${gameId}`);
            console.log('response', response)
            setGame(response.game)
            fetchRound(gameId)
        } catch(error) {
            if(error.message == 401) {
                logout();
            }
        }
    }

    const fetchRound = async (gameId) => {
        try {
            const response = await get(`/point/${gameId}/lastRound`);
            console.log('response', response)
            setLastPoint(response?.point)
            setFirstPlayerWon(response?.total_win_first)
            setSecondPlayerWon(response?.total_win_second)
        } catch(error) {
            if(error.message == 401) {
                logout();
            }
        }
    }

    const declareWinner = async () => {
        try {
            const response = await get(`/point/${gameId}/${lastPoint._id}/winner`);
            console.log('response', response)
            fetchGame(gameId)
            setButtonEnable(false)
            setAttackerObj({})
            setDefenseObj({})
        } catch(error) {
            if(error.message == 401) {
                logout();
            }
        }
    }

    useEffect(() => {
        if(championshipId && gameId) {
            fetchGame(gameId);
            socket.on(`${gameId}`, (data) => {
                console.log('data', data)
                if(data.for === "Referee") {
                    console.log(`${gameId}`, data)
                    if(data.role === 'Attacker') {
                        setAttackerObj(data)
                    } else if(data.role === 'Defense') {
                        setDefenseObj(data)
                    }
                }
            })
        }

        return () => {
            console.log("removed")
            socket.removeListener(`${championshipId}`)
        }
    }, [championshipId, gameId])

    useEffect(() => {
        if(attackerObj?.attack_player_id && defenseObj?.defense_player_id) {
            setButtonEnable(true)
        }
    }, [attackerObj, defenseObj])
    console.log('lastPoint', lastPoint)
    return (
        <div>
            <div className="w-full flex flex-col h-screen">
                <Flex vertical gap="middle" align="center" justify="center">
                    <span>Round Number {lastPoint ? lastPoint.round_number : 1}</span>
                        {
                            lastPoint?.round_winner 
                            ? lastPoint?.round_winner === game?.first_player?._id 
                                ? <span>{game?.first_player?.name} Won The Game</span>
                                : <span>{game?.second_player?.name} Won The Game</span>
                            : null
                        }
                </Flex>
                <div className="w-3/4 m-auto mt-48">
                    <Flex gap={100} align="center" justify="center">
                        <Avatar size={200}>
                            {`${game?.first_player?.name} : ${firstPlayerWon}`}
                        </Avatar>
                        <Avatar shape="square" style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>VS</Avatar>
                        <Avatar size={200}>
                            {`${game?.second_player?.name} : ${secondPlayerWon}`}
                        </Avatar>
                    </Flex>
                </div>

                {
                    !lastPoint?.round_winner && 
                    <div className="w-full h-32 fixed bottom-0">
                        <div className="flex flex-row justify-center m-16">
                            <Button type="primary" disabled={!buttonEnable} onClick={declareWinner}>Declare Winner</Button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default SingleGame;