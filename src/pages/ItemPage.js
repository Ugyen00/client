import React, { useEffect, useState } from 'react';
import DefaultItem from '../components/DefaultItem';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, Table, Modal, Form, Select, message } from 'antd';

const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([])
  const [popupModal, setPopupModal] = useState(false)
  const [editItem, setEditItem] = useState(null)

  const getAllItems = async () => {
    try {
      dispatch({
        type: 'SHOW_LOADING'
      })
      const { data } = await axios.get('/api/items/get-item');
      setItemsData(data);
      dispatch({
        type: 'HIDE_LOADING'
      })
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllItems()
  }, [])

  //handle delete
  const handleDelete = async (record) => {
    try {
      dispatch({
        type: 'SHOW_LOADING'
      })
      await axios.post('/api/items/delete-item', { itemId: record._id });
      message.success('Add Delete Successfully');
      getAllItems();
      setPopupModal(false);
      dispatch({
        type: 'HIDE_LOADING'
      })
    } catch (error) {
      dispatch({
        type: 'HIDE_LOADING'
      })
      console.log(error)
      message.error('Add Item Failed');
    }
  }


  //table
  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Image', dataIndex: 'image', render: (image, record) => <img src={image} alt={record.name} height='60' width='60' /> },
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
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: 'pointer', margin: '20px' }}
            onClick={() => {
              setEditItem(record)
              setPopupModal(true)
            }}
          />
          <DeleteOutlined
            style={{ cursor: 'pointer', margin: '10px' }}
            onClick={() => {
              handleDelete(record)
            }}
          />
        </div>
      ),
    },
  ]

  //handle from Submit
  const handleSubmit = async (value) => {
    if (editItem === null) {
      try {
        dispatch({
          type: 'SHOW_LOADING'
        })
        const res = await axios.post('/api/items/add-item', value);
        message.success('Add Item Success');
        getAllItems();
        setPopupModal(false);
        dispatch({
          type: 'HIDE_LOADING'
        })
      } catch (error) {
        dispatch({
          type: 'HIDE_LOADING'
        })
        console.log(error)
        message.error('Add Item Failed');
      }
    } else {
      try {
        dispatch({
          type: 'SHOW_LOADING'
        })
        await axios.put('/api/items/edit-item', { ...value, itemId: editItem._id });
        message.success('Item Updated Success');
        getAllItems();
        setPopupModal(false);
        dispatch({
          type: 'HIDE_LOADING'
        })
      } catch (error) {
        console.log(error)
        message.error('Add Item Failed');
      }
    }
  }

  return (
    <DefaultItem>
      <div className="d-flex justify-content-between">
        <h1>ItemPage</h1>
        <Button type="primary" onClick={() => setPopupModal(true)}>Add Item</Button>
      </div>
      <Table columns={columns} dataSource={itemsData} bordered style={{ overflow: "auto" }} />
      {
        popupModal && (
          <Modal title={`${editItem !== null ? 'Edit Item' : 'Add New Item'} `}
            open={popupModal}

            onCancel={() => {
              setEditItem(null)
              setPopupModal(false)
            }}
            footer={false}>

            <Form layout='vertical'
              initialValues={editItem}
              onFinish={handleSubmit}
            >
              <Form.Item name="name" label="Name">
                <input style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="category" label="Category">
                <Select style={{ width: '100%' }}>
                  <Select.Option value="Drinks">Drinks</Select.Option>
                  <Select.Option value="Food">Food</Select.Option>
                  <Select.Option value="Noodles">Noodles</Select.Option>
                  <Select.Option value="Snacks">Snacks</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="quantity" label="Quantity">
                <input style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="price" label="Price">
                <input style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="image" label="Image">
                <input style={{ width: '100%' }} />
              </Form.Item>
              <div className="d-flex justify-content-end">
                <Button type="primary" htmlType="submit">SAVE</Button>
              </div>
            </Form>
          </Modal>
        )
      }
    </DefaultItem>
  )
}

export default ItemPage