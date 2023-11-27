import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  CopyOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined
} from "@ant-design/icons";

import { Layout, Menu, Table, Button, Modal, message, Form, Select } from 'antd';
import '../styles/DefaultLayout.css';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

const { Header, Content, Sider } = Layout;

const DefaultLayout = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItem, loading } = useSelector(state => state.rootReducer);

  const [subTotal, setSubTotal] = useState(0)
  const [billPopup, setBillPopup] = useState(false)

  const handleIncrement = (record) => {
    dispatch({
      type: 'UPDATE_CART',
      payload: { ...record, quantity: record.quantity + 1 }
    })
  };

  const handleDecrement = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: 'UPDATE_CART',
        payload: { ...record, quantity: record.quantity - 1 }
      });
    }
  };

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  //to get local stroage data
  useEffect(() => {
    localStorage.setItem('cartItem', JSON.stringify(cartItem));
  }, [cartItem])

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  const formattedDateTime = currentDateTime.toLocaleString(undefined, options);

  //cartitem
  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Image', dataIndex: 'image', render: (image, record) => <img src={image} alt={record.name} height='50' width='50' /> },
    { title: 'Price', dataIndex: 'price' },
    {
      title: 'Quantity', dataIndex: '_id', render: (_id, record) => <div>
        <PlusCircleOutlined
          className='mx-1'
          style={{ cursor: 'pointer' }}
          onClick={() => handleIncrement(record)} />
        <b>{record.quantity}</b>
        <MinusCircleOutlined className='mx-1'
          style={{ cursor: 'pointer' }}
          onClick={() => handleDecrement(record)} />
      </div>
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (id, record) => <DeleteOutlined style={{ cursor: 'pointer' }}
        onClick={() => dispatch({
          type: 'DELETE_FROM_CART',
          payload: record,
        })} />,
    },
  ]

  useEffect(() => {
    let temp = 0;
    cartItem.forEach(item => temp = temp + (item.price * item.quantity))
    setSubTotal(temp)
  }, [cartItem])

  //handleSubmit
  const handleSubmit = async (value) => {
    try {
      const newObject = {
        ...value,
        cartItem,
        subTotal,
        tax: Number(((subTotal / 100) * 10).toFixed(2)),
        totalAmount: Number(
          Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))
        ),
        userId: JSON.parse(localStorage.getItem("auth"))._id,
      };
      await axios.post('/api/bills/add-bills', newObject);
      message.success('Bill Created Successfully!');
      navigate('/bills');

    } catch (error) {
      message.error('Something went wrong!');
      console.log(error);
    }
  }

  return (
    <Layout>
      {loading && <Spinner />}
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo">
          <img src="logo.png" alt="pos-logo" border="0" />
          <h1 className="text-center text-light font-weight-bold mt-4">POINT OF SALE</h1>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[window.location.pathname]}
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="/items" icon={<UnorderedListOutlined />}>
            <Link to="/items">Items</Link>
          </Menu.Item>
          <Menu.Item key="/bills" icon={<CopyOutlined />}>
            <Link to="/bills">Bills</Link>
          </Menu.Item>
          <Menu.Item key="/dashboard" icon={<UserOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>

          <Menu.Item key="/logout"
            icon={<LogoutOutlined />}
            onClick={() => {
              localStorage.removeItem('auth');
              navigate('/login')
            }}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#fffefe",
          }}
        >
          <div style={{ float: "left", marginLeft: '20px', marginTop: '22px' }}>
            <h1>Home</h1>
          </div>
          <div style={{ float: 'right', marginRight: '20px' }}>
            {formattedDateTime}
          </div>
        </Header>
        <Content
          style={{
            margin: '15px 10px 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 14,
            }}
          >
            <div style={{
              padding: 10,
              width: '65%',
              minHeight: 560,
              background: "#f8f9f9",
              overflow: "hidden",
            }}>
              {props.children}
            </div>
            <div style={{
              padding: 10,
              width: '35%',
              minHeight: 560,
              background: "#f8f9f9",
              overflow: "auto",
            }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#ffd885', height: '10%' }}>
                <h3 style={{ textAlign: 'left', width: '80%', height: '6%', paddingTop: '6', paddingLeft: '5px' }}>Payment</h3>
                <div className='cart-item' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '20%' }}>
                  <p style={{ paddingRight: '5px', paddingTop: '15px' }}>{cartItem.length}</p>
                  <ShoppingCartOutlined style={{ fontSize: '20px' }} />
                </div>
              </div>
              <p style={{ textAlign: 'center' }}>Item Summary</p>
              <Table columns={columns} dataSource={cartItem} bordered style={{ padding: '3px', overflowX: 'hidden', overflowY: 'auto' }} />
              <div className='d-flex justify-content-between align-items-center'>
                <div>
                  <hr />
                  <h3>SUB TOTAL: Nu.<b>{subTotal} /-</b></h3>
                </div>
              </div>
              <Modal
                title="Create Bills"
                visible={billPopup} onCancel={() => setBillPopup(false)} footer={false}>
                <Form layout='vertical'
                  onFinish={handleSubmit}
                >
                  <Form.Item name="customerName" label="Customer Name">
                    <input style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name="customerNumber" label="Contact Number">
                    <input style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item name="jonalNumber" label="Jonal Number">
                    <input style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name="paymentMode" label="Payment Method">
                    <Select style={{ width: '100%' }}>
                      <Select.Option value="cash">Cash</Select.Option>
                      <Select.Option value="online">Online</Select.Option>
                    </Select>
                  </Form.Item>

                  <div className='bill-it'>
                    <h5>Bill Total: Nu.
                      <b>{subTotal} /-</b></h5>
                  </div>
                  <h4>
                    TAX: Nu.
                    <b>{((subTotal / 100) * 10).toFixed(2)}</b>
                  </h4>
                  <h3>
                    GRAND TOTAL = {" "}
                    <b>
                      {Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))} /-
                    </b>
                  </h3>
                  <div className="d-flex justify-content-end">
                    <Button type="primary" htmlType="submit">Pay Bill</Button>
                  </div>
                </Form>
              </Modal>
              <div style={{ display: 'flex', alignItems: 'center', background: '#ffd885', height: '10%' }}>
                <h1 style={{ textAlign: 'center', width: '80%', height: '6%', paddingTop: '6', paddingLeft: '5px', cursor: 'pointer' }}> <Button type='primary' onClick={() => setBillPopup(true)}>Proceed Payment</Button></h1>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;