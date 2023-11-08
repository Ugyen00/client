import React, { useEffect, useState } from 'react';
import DefaultItem from '../components/DefaultItem';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import {
  DeleteOutlined,
} from "@ant-design/icons";
import { Table } from 'antd';

const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([])
  useEffect(() => {
    const getAllItems = async () => {
      try {
        dispatch({
          type: 'SHOW_LOADING'
        })
        const { data } = await axios.get('/api/items/get-item')
        setItemsData(data);
        dispatch({
          type: 'HIDE_LOADING'
        })
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    }
    getAllItems()
  }, [dispatch])


  //table
  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Image', dataIndex: 'image', render: (image, record) => <img src={image} alt={record.name} height='50' width='50' /> },
    { title: 'Price', dataIndex: 'price' },
    {
      title: 'Quantity', dataIndex: '_id', render: (_id, record) =>
        <div>
          <b>{record.quantity}</b>
        </div>
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (id, record) => <DeleteOutlined style={{ cursor: 'pointer' }} />,
    },
  ]


  return (
    <DefaultItem>
      <h1>ItemPage</h1>
      <Table columns={columns} dataSource={itemsData} bordered />
    </DefaultItem>
  )
}

export default ItemPage
