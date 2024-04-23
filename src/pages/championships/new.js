import { get } from "@/utils/api";
import { useEffect, useState } from "react";
import { post } from "@/utils/api";
import { useRouter } from "next/router";
import { Button, Input } from "antd";

export default function Championships() {
    const router = useRouter();
    const [type, setType] = useState(null)
    const [name, setName] = useState(null)
    const [players, setPlayers] = useState([])

    const fetchPlayers = async () => {
        try{
            const response = await get('/championship/players');
            console.log('response', response)
            setPlayers(response.players)
        } catch(error) {
            if(error.message == 401) {
                logout();
            }
        }
    }

    useEffect(() => {
        fetchPlayers()
        setType(localStorage.getItem('type'))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const object = {
            name,
            players: players
        }
        console.log('object', object)
        const response = await post('/championship', object);
        console.log('response', response)
        router.push('/championships')
    }

    return (
      <div className="w-full mt-20">
        <div className="w-1/3 m-auto flex flex-col gap-10" >
            <div className="flex flex-row justify-center">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Championship Name"/>
            </div>

            <Button type="primary" onClick={handleSubmit}>Send Invite</Button>
        </div>
      </div>
    );
}