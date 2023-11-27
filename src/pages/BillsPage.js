import React, { useEffect, useState, useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { useReactToPrint } from 'react-to-print';
import DefaultItem from '../components/DefaultItem';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import {
    EyeOutlined,
} from "@ant-design/icons";

import {Table, Modal} from 'antd';


const BillsPage = () => {
    const componentRef = useRef();
    const dispatch = useDispatch();
    const [billsData, setBillsData] = useState([])
    const [popupModal, setPopupModal] = useState(false)
    const [selectedBill, setSelectedBill] = useState(null);

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

    const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

    //add - table
    const columns = [
        { title: 'ID', dataIndex: '_id' },
        { title: 'Customer Name', dataIndex: 'customerName' },
        { title: 'Contact Number', dataIndex: 'customerNumber' },
        { title: 'Jonal Number', dataIndex: 'jonalNumber' },
        { title: 'Subtotal', dataIndex: 'subTotal' },
        { title: 'Tax', dataIndex: 'tax' },
        { title: 'Total total', dataIndex: 'totalAmount' },

        {
            title: 'Action',
            dataIndex: '_id',
            render: (id, record) => (
                <div>
                    <EyeOutlined
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            setSelectedBill(record);
                            setPopupModal(true)

                        }}
                    />
                </div>
            )
        }
    ]

    return (
        <DefaultItem>
            <div className="d-flex justify-content-between">
                <h1>Bill List</h1>
            </div>
            <Table columns={columns} dataSource={billsData} bordered style={{ overflow: "auto" }} />
            {
                popupModal && (
                    <Modal
                        width={400}
                        pagination={false}
                        title="Bill Details"
                        visible={popupModal}
                        onCancel={() => {
                            setPopupModal(false)
                        }}
                        footer={false}>
                        <div id="Bill-POS" ref={componentRef}>
                            <center id="top">
                                <div className='logo' />
                                <div className="info">
                                    <h2>Group 3 POS System</h2>
                                    <p>Contact : 12345 | Thimphu</p>
                                </div>
                            </center>
                            <div id="mid">
                                <div className='mt-2'>
                                    <p>
                                        <b>Customer Name:</b> {selectedBill.customerName}
                                        <br />
                                        <b>Contact Number:</b> {selectedBill.customerNumber}
                                        <br />
                                        Date: {selectedBill.date.toString().substring(0, 10)}
                                    </p>
                                    <hr style={{ margin: "5px" }} />
                                </div>
                            </div>
                            <div id="bot">
                                <div id="table">
                                    <table>
                                        <tr className='tabletitle'>
                                            <td className="item">
                                                <h2>Item</h2>
                                            </td>
                                            <td className="Hours">
                                                <h2>Qty</h2>
                                            </td>
                                            <td className="Rate">
                                                <h2>Price</h2>
                                            </td>
                                        </tr>
                                        {selectedBill.cartItem.map((item) => (
                                            <>
                                                <tr className="service">
                                                    <td className="tableitem">
                                                        <p className="itemtext">{item.name}</p>
                                                    </td>
                                                    <td className="tableitem">
                                                        <p className="itemtext">{item.quantity}</p>
                                                    </td>
                                                    <td className="tableitem">
                                                        <p className="itemtext">{item.price}</p>
                                                    </td>
                                                    <td className="tableitem">
                                                        <p className="itemtext">{item.quantity * item.name}
                                                        </p>
                                                    </td>
                                                </tr>
                                            </>
                                        ))}

                                        <tr className='tabletitle'>
                                            <td />
                                            <td />
                                            <td className="Rate">
                                                <h2>tax</h2>
                                            </td>
                                            <td className="payment">
                                                <h2>{selectedBill.taxt}</h2>
                                            </td>
                                        </tr>
                                        <tr className='tabletitle'>
                                            <td />
                                            <td />
                                            <td className="Rate">
                                                <h2>Grand total</h2>
                                            </td>
                                            <td className="payment">
                                                <h2>{selectedBill.totalAmount}</h2>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>

                        </div>
                        <div className="d-flex justify-content-end mt-3">
                            <Button type="primary" onClick={handlePrint}> Print </Button>

                        </div>
                    </Modal>
                )
            }
        </DefaultItem>
    );
};

export default BillsPage;
