import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { get, post } from "@/utils/api";
import { socket } from "@/utils/socket";

const SingleGame = ({ user }) => {
    const router = useRouter();
    const { championshipId, gameId } = router.query;
    console.log('championshipId', championshipId)
    console.log('gameId', gameId)
    const [game, setGame] = useState(null)
    const [lastPoint, setLastPoint] = useState(null)
    const [attackerObj, setAttackerObj] = useState({});
    const [defenseObj, setDefenseObj] = useState({});
    const [buttonEnable, setButtonEnable] = useState(false);
    const [role, setRole] = useState('asd');
    const [defenseArray, setDefenseArray] = useState([]);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [myObject, setMyObject] = useState({})
    const [disableNumbers, setDisabledNumbers] = useState(false);
    const [disableSubmitBtn, setDisabledSubmitBtn] = useState(false);

    const fetchGame = async (gameId) => {
        try {
            const response = await get(`/game/${gameId}`);
            setGame(response.game)
        } catch(error) {
            console.log('error', error)
        }
    }

    const fetchRound = async (gameId) => {
        try {
            const response = await get(`/point/${gameId}/lastRound`);
            setLastPoint(response?.point)
            // if(response?.point) {
            //     // if(response?.point?.attack?.player_id === user._id) {
            //     //     setMyObject({ role: "Attacker", attack_player_id: user._id, round_number: response.point.round_number });
            //     // } else if(response?.point?.defense?.player_id === user._id) {
            //     //     setMyObject({ role: "Defense", defense_player_id: user._id, round_number: response.point.round_number, defense_array_length: game.second_player.defense_set_length });
            //     // }
            // } else {
                if(game.first_player._id === user._id) {
                    setMyObject({ role: "Attacker", attack_player_id: user._id, round_number: response?.point?.round_number || 1 });
                } else if(game.second_player._id === user._id){
                    setMyObject({ role: "Defense", defense_player_id: user._id, round_number: response?.point?.round_number || 1, defense_array_length: game.second_player.defense_set_length, defense_array: [] });
                }
            // }
        } catch(error) {
            console.log('error', error)
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
                const response = await post(`/point/${gameId}/new`, object);
                console.log('response', response)
                setDisabledSubmitBtn(true);
            } else if(myObject.role === "Defense") {
                const object = {
                    defense_player_id: myObject.defense_player_id,
                    defense_array: myObject.defense_array,
                    round_number: myObject.round_number
                }
                const response = await post(`/point/${gameId}/defensePoint`, object);
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
        } else if(myObject.role === 'Defense') {
            const defense_array = myObject.defense_array;
            defense_array.push(num);
            setMyObject({ ...myObject, defense_array: defense_array });
            if(myObject.defense_array_length === defense_array.length) {
                setDisabledNumbers(true)
            }
        }
    }

    useEffect(() => {
        if(championshipId && gameId && user._id) {
            fetchGame(gameId);
            socket.on(`${gameId}:players`, (data) => {
                fetchGame(data.game_id);
                fetchRound(data.game_id);
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

    useEffect(() => {
        if(attackerObj?._id && defenseObj?._id) {
            setButtonEnable(true)
        }
    }, [attackerObj, defenseObj])

    return (
        <div>
            <div className="w-full flex flex-col h-screen">
                <div className="flex flex-row justify-center">
                    <span>Round Number {myObject.round_number}</span>
                </div>
                <div className="w-3/4 m-auto mt-48">
                    <div className="flex flex-row justify-center gap-80">
                        <div className="h-48 w-48 bg-black">

                        </div>

                        <div className="h-48 w-48 bg-black">

                        </div>
                    </div>
                    <div className="flex flex-row justify-center gap-80">
                        <div className="w-48 bg-white text-center">
                            <span>{game?.first_player?.name}</span>
                        </div>
                        <div className="w-48 bg-white text-center">
                            <span>{game?.second_player?.name}</span>
                        </div>
                    </div>
                </div>
                <div className="w-full h-32 fixed bottom-0">
                    <div className="flex flex-col gap-1">
                        <div className="text-center">{role}</div>
                        <div className="flex flex-row justify-center items-center gap-2">
                            {
                                Array.from({ length: 10 }, (_, i) => (
                                    <div 
                                        className={`w-12 h-12 bg-black text-white text-center leading-10 cursor-pointer`}
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
                                    </div>
                                ))
                            }
                        </div>
                        <div className="flex flex-row justify-center items-center">
                            <button className="w-32 h-10 bg-black text-white" 
                            onClick={() => {
                                if(!disableSubmitBtn) {
                                    handleSubmit()
                                }
                            }}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleGame;