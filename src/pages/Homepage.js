import React, { useState, useEffect } from 'react'
import DefaultLayout from '../components/DefaultLayout'
import axios from 'axios'
import { Col, Row } from 'antd';
import ItemList from '../components/ItemList';
import { useDispatch } from 'react-redux';

const Homepage = () => {
  const [itemsData, setItemsData] = useState([])
  const [selecedCategory, setSelectedCategory] = useState('All')
  const categories = [
    {
      name: 'All',
      imageUrl: 'https://imgs.search.brave.com/wAdJI5uh_gOmHy82WPoXEAbUTF07XwNJZfnOkRqm0RI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3cy4xMjNyZi5j/b20vaW1hZ2VzL2ph/Y2tmL2phY2tmMTMw/My9qYWNrZjEzMDMw/MDI0Ni8xODM2NjMz/OS10b3Atdmlldy1v/Zi1wbGF0ZXMtd2l0/aC1mYXN0LWZvb2Qu/anBn'
    },
    {
      name: 'Drinks',
      imageUrl: 'https://crushfoodng.com/wp-content/uploads/2023/01/coca-cola-fanta-sprite-bottles-chisinau-moldova-november-isolated-white-three-drinks-produced-company-64145085.jpg'
    },
    {
      name: 'Food',
      imageUrl: 'https://www.eatingwell.com/thmb/zvHrm_Z8F2qLeJenpJ6lYodtq7M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/57831531-73819d8ce8f5413cac42cf1c907bc37a.jpg'

    },
    {
      name: 'Snacks',
      imageUrl: 'https://c.ndtvimg.com/2020-06/dra42d7g_junk-food-_625x300_30_June_20.jpg?im=FaceCrop,algorithm=dnn,width=1200,height=886'
    },
    {
      name: 'Noodles',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmJtmpMkSeWtaOhdJMTUEYf6FeWi5PKOBGOPjq0hdPWMftwagBuqtNVhyApb61e6Ky_wg&usqp=CAU'
    }
  ]
  const dispatch = useDispatch();

  //useEffect
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

  return (
    <DefaultLayout>
      <div className="d-flex">
        {categories.map(category => (
          <div key={category.name} className={`d-flex category ${selecedCategory === category.name && "category-active"}`}
            onClick={() => setSelectedCategory(category.name)}>
            <h4>{category.name}</h4>
            <img src={category.imageUrl} alt={category.name} height="40" width="45" />
          </div>
        ))}
      </div>
      <Row>
        {
          (selecedCategory === 'All' ? itemsData : itemsData.filter(i => i.category === selecedCategory)).map(item => (
            <Col xs={24} lg={6} md={12} sm={6}>
              <ItemList key={item.id} item={item} />
            </Col>
          ))
        }
      </Row>
    </DefaultLayout>
  )
}

export default Homepage
