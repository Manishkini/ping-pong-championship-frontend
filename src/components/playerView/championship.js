import Link from 'next/link';
import { useRouter } from 'next/router';
import { get } from '@/utils/api';
import { useEffect, useState } from 'react';

const PlayerViewChampionship = ({ championships, user }) => {
    const router = useRouter();
    const handleJoin = async (championshipId, playerId) => {
        try{
            const response = await get(`/championship/${championshipId}/join/${playerId}`);
            console.log('response', response)
        } catch(error) {
            console.log('error', error)
        }
    }

    const checkAlreadyJoined = (players) => {
        const playerObj = players.find((obj) => obj.player_id === user._id);
        if(playerObj.player_id === user._id) {
            return playerObj.status === "Joined";
        }
        return false;
    }

    return (
        <div>
            <section className='grid grid-cols-4 gap-4'>
                {
                    championships?.length 
                    ?   championships.map((obj) => (
                            <div className='w-48 h-48 bg-slate-400 text-center' key={obj._id}>
                                <div className=''>{obj.name}</div>
                                <div className=''>{`Status: ${obj.status}`}</div>
                                {
                                    checkAlreadyJoined(obj.players)
                                    ?   <button className="add-buttons" onClick={() => router.push(`/championships/${obj._id}`)}>Enter</button>
                                    :   <button className="add-buttons" onClick={() => handleJoin(obj._id, user._id)}>
                                            Join
                                        </button>
                                }

                            </div>
                        ))
                    :   null
                }
            </section>
        </div>
    )
}

export default PlayerViewChampionship;