import { React, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { message } from 'antd';
import { Button } from 'antd';


const Mail = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    useEffect(() => {
        dispatch({
            type: 'HIDE_LOADING'
        })
    }, [dispatch])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch({
                type: 'SHOW_LOADING'
            });
            await axios.post('/forgot-password/get-link/' + email, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            });
            dispatch({ type: "HIDE_LOADING" });
            message.success('Email sent successfully');

        } catch (error) {
            dispatch({
                type: 'HIDE_LOADING'
            });
            console.log(error);
            message.error('Failed to send email');
        }
    };

    return (
        <>
            <div className="login">
                <div className="login-form">
                    <h1>Mail</h1>
                    <form
                        onSubmit={handleSubmit}
                        style={{ width: '100', padding: '20px' }}
                    >
                        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%' }} />
                        <Button type="primary" htmlType="submit" style={{ alignItems: 'center' }}>
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Mail