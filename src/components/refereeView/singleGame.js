import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { get } from "@/utils/api";
import { socket } from "@/utils/socket";

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

    const fetchGame = async (gameId) => {
        try {
            const response = await get(`/game/${gameId}`);
            console.log('response', response)
            setGame(response.game)
            fetchRound(gameId)
        } catch(error) {
            console.log('error', error)
        }
    }

    const fetchRound = async (gameId) => {
        try {
            const response = await get(`/point/${gameId}/lastRound`);
            console.log('response', response)
            setLastPoint(response?.point)
        } catch(error) {
            console.log('error', error)
        }
    }

    const declareWinner = async () => {
        try {
            const response = await get(`/point/${gameId}/roundWinner/${lastPoint.round_number}`);
            console.log('response', response)
            setLastPoint(response?.point)
        } catch(error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        if(championshipId && gameId) {
            fetchGame(gameId);
        }
    }, [championshipId, gameId])

    useEffect(() => {
        if(attackerObj?._id && defenseObj?._id) {
            setButtonEnable(true)
        }
    }, [attackerObj, defenseObj])

    return (
        <div>
            <div className="w-full flex flex-col h-screen">
                <div className="flex flex-row justify-center">
                    <span>Round Number {lastPoint ? lastPoint.round_number : 1}</span>
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
                    <div className="flex flex-row justify-center m-16">
                        <button className="w-32 h-10 bg-black text-white" onClick={declareWinner}>Declare Winner</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleGame;