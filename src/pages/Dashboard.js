import React, { useEffect, useState } from 'react';
import DefaultItem from '../components/DefaultItem';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import {Table} from 'antd';

const Dashboard = () => {
const [billsData, setBillsData] = useState([]);
const dispatch = useDispatch();

const getAllBills = async () => {
        try {
            dispatch({
                type: 'SHOW_LOADING'
            })
            const { data } = await axios.get('/api/bills/get-bills');
            setBillsData(data);
            dispatch({
                type: 'HIDE_LOADING'
            })
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllBills()
    }, [])

  const columns = [
        { title: 'ID', dataIndex: '_id' },
        { title: 'Customer Name', dataIndex: 'customerName' },
        { title: 'Contact Number', dataIndex: 'customerNumber' },
    ]

    return (
         <div>
            <DefaultItem>
                <h1>Dashboard</h1>
                 <Table columns={columns} dataSource={billsData} bordered style={{ overflow: "auto" }} />
            </DefaultItem>
        </div>
    );
};

export default Dashboard;