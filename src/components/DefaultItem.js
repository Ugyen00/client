import React, { useState, useEffect } from 'react';
import {
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  CopyOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import { Layout, Menu } from 'antd';
import '../styles/DefaultLayout.css';
import { Link } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const DefaultItem = (props) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID); // Clear the interval when the component unmounts
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
          <Menu.Item key="/customers" icon={<UserOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/logout" icon={<LogoutOutlined />}>
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
