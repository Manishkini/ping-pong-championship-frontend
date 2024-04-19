import { useEffect, useState } from "react";
import SingleGameRefereeView from "@/components/refereeView/singleGame"
import SingleGamePlayerView from "@/components/playerView/singleGame"

export default function SingleGame() {
  const [type, setType] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    setType(localStorage.getItem('type'));
    setUser(JSON.parse(localStorage.getItem('user')))
  }, [])

  return (
    <div>
        {
          type === 'referee' && <SingleGameRefereeView user={user} /> 
        }
        {
          type === 'player' && <SingleGamePlayerView user={user} />
        }
    </div>
  );
}