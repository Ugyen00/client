import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  CopyOutlined,
  UnorderedListOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

import { Layout, Menu } from 'antd';
import '../styles/DefaultLayout.css';
import { Link, useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const DefaultItem = (props) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/items');
        setItems(response.data.items);
        console.log(response.data.items);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    if (!loading && items && items.length > 0) {
      const lowQuantityItems = items.filter(item => item.quantity < 5);
      if (lowQuantityItems.length > 0) {
        const lowItemsNames = lowQuantityItems.map(item => item.name).join(', ');
        message.success(`Items running low: ${lowItemsNames}`);
        alert(`Items running low: ${lowItemsNames}`);
      }
    }
  }, [items, loading]);


  return (
    <Layout>
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
          <img src="logo.png" alt="pos-logo" border="0" width="10%" />
          <h1 className="text-center text-light font-weight-bold mt-4">POINT OF SALE</h1>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={window.location.pathname}
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
          <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
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
            <h1>Inventory Management</h1>
          </div>
          <div style={{ float: 'right', marginRight: '20px' }}>
            {formattedDateTime}
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 24,
            }}
          >
            <div style={{
              padding: 20,
              width: '100%',
              minHeight: 560,
              background: "#f8f9f9",
              overflow: 'auto',
            }}>
              {props.children}
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultItem;
