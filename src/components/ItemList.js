import React from 'react'
import { Button, Card } from 'antd';
import { useDispatch } from 'react-redux';


const ItemList = ({ item }) => {
  const dispatch = useDispatch();
  const handAddTOCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...item, quantity: 1 }

    })
  }
  const { Meta } = Card;
  return (
    <div>
      <Card
        style={{ width: 180, height: 250, margin: 10 }}
        cover={<img alt={item.name} src={item.image} style={{ height: 150 }} />}>
        <Meta title={item.name} />
        <div className='item-button'>
          <Button onClick={() => handAddTOCart()}>
            Add to Cart
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default ItemList
