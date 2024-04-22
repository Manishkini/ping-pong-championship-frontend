import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { get, post } from "@/utils/api";
import { socket } from "@/utils/socket";
import { Avatar, Button, Flex, Tag, message } from "antd";

const SingleGame = ({ user }) => {
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const { championshipId, gameId } = router.query;
    const [game, setGame] = useState(null)
    const [lastPoint, setLastPoint] = useState(null)
    const [firstPlayerWon, setFirstPlayerWon] = useState(0);
    const [secondPlayerWon, setSecondPlayerWon] = useState(0);
    const [myObject, setMyObject] = useState({})
    const [disableNumbers, setDisabledNumbers] = useState(false);
    const [disableSubmitBtn, setDisabledSubmitBtn] = useState(true);

    const fetchGame = async (gameId) => {
        try {
            const response = await get(`/game/${gameId}`);
            setGame(response.game)
        } catch(error) {
            if(error.message == 401) {
                logout();
            }
        }
    }

    const fetchRound = async (gameId) => {
        try {
            const response = await get(`/point/${gameId}/lastRound`);
            setLastPoint(response?.point)
            setFirstPlayerWon(response?.total_win_first)
            setSecondPlayerWon(response?.total_win_second)
            if(response?.point) {
                console.log(response?.point?.attack)
                if(response?.point?.attack?.player_id?._id === user._id) {
                    setMyObject({ 
                        role: "Attacker",
                        attack_player_id: user._id,
                        round_number: response.point.round_number,
                        round_winner: response.point.round_winner,
                        round_loser: response.point.round_loser,
                    });
                } else if(response?.point?.defense?.player_id?._id === user._id) {
                    setMyObject({ 
                        role: "Defense",
                        defense_player_id: user._id,
                        round_number: response.point.round_number,
                        defense_array_length: response.point.defense.player_id.defense_set_length,
                        defense_array: [],
                        round_winner: response.point.round_winner,
                        round_loser: response.point.round_loser,
                    });
                }
            }
        } catch(error) {
            if(error.message == 401) {
                logout();
            }
        }
    }

    const handleSubmit = async () => {
        try {
            if(myObject.role === "Attacker") {
                const object = {
                    attack_player_id: myObject.attack_player_id,
                    selected_number: myObject.selected_number,
                    round_number: myObject.round_number
                }
                const response = await post(`/point/${gameId}/${lastPoint._id}/attack`, object);
                console.log('response', response)
                setDisabledSubmitBtn(true);
            } else if(myObject.role === "Defense") {
                const object = {
                    defense_player_id: myObject.defense_player_id,
                    defense_array: myObject.defense_array,
                    round_number: myObject.round_number
                }
                const response = await post(`/point/${gameId}/${lastPoint._id}/defense`, object);
                console.log('response', response)
                setDisabledSubmitBtn(true);
            }
        } catch(error) {
            console.log('error', error)
        }
    }

    const handleNumbers = (num) => {
        if(myObject.role === 'Attacker') {
            setMyObject({ ...myObject, selected_number: num });
            setDisabledNumbers(true)
            setDisabledSubmitBtn(false);
        } else if(myObject.role === 'Defense') {
            let defense_array = myObject.defense_array;
            if(defense_array.includes(num)) {
                defense_array = defense_array.filter((n) => n !== num)
            } else {
                defense_array.push(num);
            }
            setMyObject({ ...myObject, defense_array: defense_array });
            if(myObject.defense_array_length === defense_array.length) {
                setDisabledNumbers(true)
                setDisabledSubmitBtn(false);
            }
        }
    }

    const fetchColor = (num) => {
        if(myObject.role === 'Attacker') {
            return num === myObject.selected_number ? 'green' : 'black'
        } else if(myObject.role === 'Defense') {
            return myObject.defense_array.includes(num) ? 'green' : 'black'
        }
    }

    useEffect(() => {
        if(championshipId && gameId && user._id) {
            fetchGame(gameId);
            socket.on(`${gameId}`, (data) => {
                console.log('data', data)
                if(data.for === "Player") {
                    console.log(`${gameId}`, data)
                    fetchGame(data.game_id);
                    setDisabledNumbers(false);
                    setDisabledSubmitBtn(true);
                    if(data.round_winner === user._id) {
                        messageApi.open({
                            type: 'success',
                            content: 'You won the round',
                          });
                    } else {
                        messageApi.open({
                            type: 'error',
                            content: 'You lost the round',
                          });
                    }
                }
            })
    
            return () => {
                socket.off(`${championshipId}`)
            }
        }
    }, [championshipId, gameId, user])

    useEffect(() => {
        if(game && user._id) {
            fetchRound(game._id)
        }
    }, [game, user])

    console.log("myObject", myObject)
    return (
        <div>
            {contextHolder}
            <div className="w-full flex flex-col h-screen">
                <Flex vertical gap="middle" align="center" justify="center">
                    <span>Round Number {myObject.round_number}</span>
                    {
                        myObject.round_winner && <span>You {myObject.round_winner === user._id ? `Won` : `Lost`} This Game.</span>
                    }
                </Flex>
                <div className="w-3/4 m-auto mt-48">
                    <Flex gap={100} align="center" justify="center">
                        <Avatar 
                            size={200} 
                            style={game?.first_player?._id === user._id ? { backgroundColor: 'green', color: 'black' } : {}}
                        >
                            {`${game?.first_player?.name} : ${firstPlayerWon}`}
                        </Avatar>
                        <Avatar shape="square" style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>VS</Avatar>
                        <Avatar 
                            size={200} 
                            style={game?.second_player?._id === user._id ? { backgroundColor: 'green', color: 'black' } : {}}
                        >
                            {`${game?.second_player?.name} : ${secondPlayerWon}`}
                        </Avatar>
                    </Flex>
                </div>

                {
                    !myObject.round_winner && 
                    <div className="w-full h-32 fixed bottom-0">
                        <Flex vertical gap="small" align="center" justify="center">
                            <Flex gap="middle" align="center" justify="center">
                                {
                                    myObject.role === "Attacker"
                                    ?   <Tag color="green">Attacker</Tag>
                                    :   <Flex align="center" justify="center">
                                            <Tag color="red">Defender</Tag>
                                            <Tag color="red">Defense Array Size Left: {myObject?.defense_array_length - myObject?.defense_array?.length}</Tag>
                                        </Flex>
                                }
                                
                            </Flex>
                            <Flex gap="middle" align="center" justify="center">
                                {
                                    Array.from({ length: 10 }, (_, i) => (
                                        <Tag 
                                            color={fetchColor(i+1)}
                                            key={i+1}
                                            onClick={() => { 
                                                if(myObject.role === 'Attacker' && !disableNumbers) {
                                                    handleNumbers(i+1)
                                                } else if(myObject.role === 'Defense' && !disableNumbers) {
                                                    handleNumbers(i+1)
                                                }
                            
                                            }}
                                        >
                                            {i + 1}
                                        </Tag>
                                    ))
                                }
                            </Flex>
                            <Flex gap="middle" align="center" justify="center">
                                <Button 
                                    type="primary"
                                    disabled={disableSubmitBtn}
                                    onClick={() => {
                                        if(!disableSubmitBtn) {
                                            handleSubmit()
                                        }
                                    }} 
                                >
                                    Submit
                                </Button>
                            </Flex>
                        </Flex>
                    </div>
                }
            </div>
        </div>
    )
}

export default SingleGame;