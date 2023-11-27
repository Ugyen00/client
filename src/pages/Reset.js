import { Button } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import queryString from 'query-string';
const Reset = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const dispatch = useDispatch();
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    const token = queryParams.token;
    console.log(token)
    localStorage.setItem('token', token)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const resetToken = localStorage.getItem('token')
        console.log(resetToken, "hhhhhhhskskk")
        const data = {
            newPassword,
            confirmPassword,
            resetToken,
        }
        console.log(data)
        try {
            dispatch({ type: 'SHOW_LOADING' });

            if (newPassword !== confirmPassword) {
                message.error('Passwords do not match');
                return;
            }

            const response = await axios.patch('/forgot-password/change-password', {
                data
            });
            console.log(response);
            dispatch({ type: 'SHOW_LOADING' });
            message.success('Password reset successfully');
        } catch (error) {
            dispatch({ type: 'SHOW_LOADING' });
            console.log(error);
            message.error('Failed to reset password');
        }
    };

    return (
        <>
            <div className="login">
                <div className="login-form">
                    <h1>Reset Password</h1>
                    <form onSubmit={handleSubmit} style={{ width: '100%', padding: '20px' }}>
                        <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                        <Button type="primary" htmlType="submit" style={{ alignItems: 'center' }}>
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )
};

export default Reset;
