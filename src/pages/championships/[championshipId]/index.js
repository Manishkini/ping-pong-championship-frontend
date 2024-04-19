import { useEffect, useState } from "react";
import SingleChampionshipRefereeView from "@/components/refereeView/singleChampionship"
import SingleChampionshipPlayerView from "@/components/playerView/singleChampionship"

export default function SingleChampionship() {

    const [type, setType] = useState(null)

    useEffect(() => {
      setType(localStorage.getItem('type'))
    }, [])

    return (
      <div >
        {
          type === 'referee' && <SingleChampionshipRefereeView /> 
        }
        {
          type === 'player' && <SingleChampionshipPlayerView />
        }
      </div>
    );
}