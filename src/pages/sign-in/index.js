import { useEffect, useState } from "react";
import { get, post } from "@/utils/api";
import { useRouter } from "next/router";

export default function SignIn() {
    const router = useRouter();
    const [type, setType] = useState(null);
    const [name, setName] = useState(null);
    const [password, setPassword] = useState(null);


    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(event.target)
        console.log(type)
        console.log(name)
        console.log(password)

        const object = {
            type,
            name,
            password
        }
        const response = await post('/auth/login', object);
        console.log('response', response)
        localStorage.setItem('token', response.token);
        localStorage.setItem('type', type);
        localStorage.setItem('user', JSON.stringify(response.user));
        router.push('/')
    }


    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="type">Type</label>
                        <select name="type" required value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="" selected disabled>Select Type</option>
                            <option value="referee">Referee</option>
                            <option value="player">Player</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input name="name" type="text" value={name} required onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input name="password" type="password" value={password} required onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}
