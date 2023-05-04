/* eslint-disable jsx-a11y/anchor-is-valid */

import React,{useState} from 'react'
import { Card, Tooltip } from "antd";
import laptop from '../../images/laptop.png'
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { showAverage } from '../../functions/rating';
import _ from "lodash"
import {useSelector, useDispatch} from 'react-redux'

const { Meta } = Card

const ProductCard = ({product}) => {
  const [tooltip, setTooltip] = useState("Click to add")

  // redux
  const {user, cart} = useSelector((state) => ({...state}))
  const dispatch = useDispatch()

  const handleAddToCart = () => {
    //create cart array and initialize it to empty
    let cart = []

    if (typeof window !== "undefined"){
      if(localStorage.getItem("cart"))
      cart = JSON.parse(localStorage.getItem("cart"))
    

    //push products to the cart
    cart.push({
      ...product,
      count: 1,
    })

    //remove duplicates and save the cart back in local storage
    let unique = _.uniqWith(cart, _.isEqual)

    //save to local storage
    localStorage.setItem("cart", JSON.stringify(unique))

    //show tooltip
    setTooltip("Added")

    //redux
    dispatch({
      type: "ADD_TO_CART",
      payload: unique
    })

    //show cart items in side drawer
    dispatch({
      type: "SET_VISIBLE",
      payload: true
    })
   }
  }
    const {images,title, description, slug, price} = product
    return (
      <>
       {product && product.ratings && product.ratings.length > 0 ? 
        showAverage(product)
         : <div className='text-center pt-1 pb-3'> No rating yet</div>}
        <Card
         cover={
             // eslint-disable-next-line jsx-a11y/alt-text
             <img
               src={images && images.length ? images[0].url : laptop}
               style={{ height: "150px", objectFit:"cover"}}
               className="p-1"
             />
            }

          actions={[
              <Link to={`/product/${slug}`}> 
                 <EyeOutlined className="text-warning" /> <br /> View Product
              </Link>,
              <Tooltip title={tooltip}>
                <a onClick={handleAddToCart} disabled={product.quantity < 1}> 
                  <ShoppingCartOutlined className="text-danger" /> <br/> 
                  {product.quantity < 1 ? 'Out Of Stock' : 'Add To Cart'}
                </a>
              </Tooltip>,
          ]
          }
        >
          <Meta
            title={`${title} - $${price}`}
            description={`${description && description.substring(0, 40)}...`}
          />
        </Card>
      </>
    )
}

export default ProductCard
