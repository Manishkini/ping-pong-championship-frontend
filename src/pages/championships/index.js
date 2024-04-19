import { get } from "@/utils/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import RefereeViewChampionship from '@/components/refereeView/championship'
import PlayerViewChampionship from '@/components/playerView/championship'

export default function Championships() {

    const [type, setType] = useState(null)
    const [user, setUser] = useState(null)
    const [championships, setChampionships] = useState([])

    const fetchChampionships = async () => {
        try{
            const response = await get('/championship');
            console.log('response', response)
            setChampionships(response.championship)
        } catch(error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        fetchChampionships()
        setType(localStorage.getItem('type'))
        setUser(JSON.parse(localStorage.getItem('user')))
    }, [])

    return (
      <div>
        {
            type === 'referee' && <RefereeViewChampionship championships={championships} /> 
        }
        {
            type === 'player' && <PlayerViewChampionship championships={championships} user={user} />
        }
      </div>
    );
}