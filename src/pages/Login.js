import { React, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { message } from 'antd';
import { Form, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';


const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (value) => {
        try {
            dispatch({
                type: 'SHOW_LOADING'
            })
            const res = await axios.post('/api/users/login', value);
            dispatch({ type: "HIDE_LOADING" });
            message.success('Login Successfully');
            localStorage.setItem('auth', JSON.stringify(res.data));
            navigate('/');
        } catch (error) {
            dispatch({
                type: 'HIDE_LOADING'
            })
            console.log(error)
            message.error('Login Failed');
        }
    };
    //currently login user
    useEffect(() => {
        if (localStorage.getItem('auth')) {
            localStorage.getItem('auth');
            navigate('/');
        }
    }, [navigate]);

    return (
        <>
            <div className="login">
                <div className="cover-img">
                    <img src='./utils/cover.png' alt='Cover' />
                    <h1>POINT OF SALE</h1>
                </div>
                <div className="login-form">
                    <h1>LOGIN</h1>
                    <Form layout='vertical'
                        onFinish={handleSubmit}
                        style={{ width: '100', padding: '20px' }}
                    >
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your email!',
                                },
                            ]}
                        >
                            <input style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your password!',
                                },
                            ]}
                        >
                            <input style={{ width: '100%' }} type="password" />
                        </Form.Item>
                        <div className="d-flex justify-content-end">
                            <Link to='/sendmail'>Forget Password?</Link>
                        </div>
                        <Button type="primary" htmlType="submit" style={{ alignItems: 'center' }}>LOGIN</Button>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default Login
