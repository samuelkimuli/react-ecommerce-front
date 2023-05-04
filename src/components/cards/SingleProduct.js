/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, {useState} from 'react'
import {Card, Tabs, Tooltip} from 'antd'
import { Link } from 'react-router-dom'
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Laptop from "../../images/laptop.png"
import ProductListItems from './ProductListItems';
import StarRating from 'react-star-ratings'
import RatingModal from '../modal/RatingModal';
import { showAverage } from '../../functions/rating';
import _ from 'lodash'
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { addToWishlist } from '../../functions/user';

const {TabPane} = Tabs


const {Meta} = Card


// this is the child component of the product page
const SingleProduct = ({product, onStarClick, star }) => {
    const [tooltip, setTooltip] = useState("Click to add")

    //redux
    const { user, cart} = useSelector((state) => ({...state}))
    const dispatch = useDispatch()

    //router
    let history = useHistory()

    const {title,description, images, _id, } = product

    const handleAddToCart = () => {
      //create cart array
      let cart = []

      if (typeof window !== "undefined"){
        if (localStorage.getItem("cart")){
          cart = JSON.parse(localStorage.getItem("cart"))
        }

        //push product to cart
        cart.push({
          ...product,
          count: 1,
        })

        //remove duplicates
        let unique = _.uniqWith(cart, _.isEqual)

        //save to local storage
        localStorage.setItem("cart", JSON.stringify(unique))

        //show tooltip
        setTooltip("Added")

        //dipatch to the redux store
        dispatch({
          type: "ADD_TO_CART",
          payload: unique,
        })

        //make side drawer visible
        dispatch({
          type: "SET_VISIBLE",
          payload: true,
        })
      }
    }

    const handleAddToWishList = (e) => {
      e.preventDefault()
      addToWishlist(product._id, user.token).then((res) => {
        console.log('ADDED TO WISHLIST', res.data)
        toast.success('Added to wishlist')
        history.push('/user/wishlist')
      })
    }


    return (
        <>
         <div className="col-md-7">
          {images && images.length ? (
            <Carousel showArrows={true} autoPlay infiniteLoop>
             {images && images.map((i) => <img src={i.url} key={i.public_id} />)}
           </Carousel>
          ) : (
            <Card cover={<img src={Laptop} className='mb-3 card-image'/>}></Card>
          )}

          <Tabs>
            <TabPane tab="Description" key="1">
               {description && description}
            </TabPane>
            <TabPane tab="Win!" key="2">
              Enter Raffle Draw to win this product.
            </TabPane>
          </Tabs>
           
         </div>

         <div className="col-md-5">
           <h1 className='bg-info p-3'>{title}</h1>

           {product && product.ratings && product.ratings.length > 0 ? 
            showAverage(product)
             : <div className='text-center pt-1 pb-3'> No rating yet</div>}
           
           <Card
             actions={[
               <Tooltip title={tooltip}>
                <a onClick={handleAddToCart}>
                   <ShoppingCartOutlined className="text-success" /> <br/>
                     Add to Cart
                </a>
               </Tooltip>, 
                 <a onClick={handleAddToWishList}>
                  < HeartOutlined className='text-info' /> <br /> Add to Wishlist
                 </a>,
                 <RatingModal>
                 <StarRating 
                   name={_id}
                   numberOfStars={5}
                   rating={star}
                   changeRating={onStarClick}
                   isSelectable = {true}
                   starRatedColor='red'
                 />
                 </RatingModal>,
             ]}
           >
             <ProductListItems product={product}/>
           </Card>
         </div>
        </>
    )
}

export default SingleProduct
