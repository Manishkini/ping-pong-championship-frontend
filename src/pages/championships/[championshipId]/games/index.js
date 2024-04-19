import { useEffect, useState } from "react";
import GamesRefereeView from "@/components/refereeView/games"
import GamesPlayerView from "@/components/playerView/games"

export default function Games() {
  const [type, setType] = useState(null)

  useEffect(() => {
    setType(localStorage.getItem('type'))
  }, [])

    return (
      <div>
        {
          type === 'referee' && <GamesRefereeView /> 
        }
        {
          type === 'player' && <GamesPlayerView />
        }
      </div>
    );
}