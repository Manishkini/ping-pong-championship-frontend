import { useEffect, useState } from "react";
import { get, post } from "@/utils/api";
import { useRouter } from "next/router";
import { Button, Flex, Input, Select } from "antd";
import { logout } from "@/utils";

export default function SignIn() {
    const router = useRouter();
    const [type, setType] = useState(null);
    const [name, setName] = useState(null);
    const [password, setPassword] = useState(null);


    const handleSubmit = async () => {
        try{
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
            router.push('/championships')
        } catch(error) {
            if(error.message == 401) {
                logout();
            }
        }
    }


    return (
        <div>
            <div className="w-full mt-20">
                <div className="w-1/3 m-auto">
                    <Flex vertical gap="large" justify="center" align="center">
                        <Select
                            defaultValue={type}
                            placeholder="Select a type"
                            value={type}
                            onChange={(value) => setType(value)}
                            options={[
                                { value: 'referee', label: 'Referee' },
                                { value: 'player', label: 'Player' },
                            ]}
                        />
                        <Input placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}/>
                        <Input.Password placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <Button type="primary" onClick={handleSubmit}>Submit</Button>
                    </Flex>
                </div>
            </div>
        </div>
    );
}
