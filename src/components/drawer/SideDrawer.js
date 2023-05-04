/* eslint-disable jsx-a11y/alt-text */

import React from 'react'
import {Drawer, Button} from "antd"
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import laptop from '../../images/laptop.png'

const SideDrawer = () => {
    const dispatch = useDispatch()

    const {drawer, cart } = useSelector((state) => ({...state}))

    const imageStyle ={
        width: "100px",
        height: "50px",
        objectFit: "cover",
    }

  return (
    <Drawer 
     title={`Cart /${cart.length} Product/s`}
     placement="right"
     closable={false}
     onClose={() => {
        dispatch({
            type: "SET_VISIBLE",
            payload: false,
        })
     }}
     visible={drawer}
    > 
      {
        cart.map((p) => (
            <div className="row" key={p._id}>
               <div className='col'>
                 { p.images[0] ? (
                    <>
                     <img src={p.images[0].url} style={imageStyle} />
                     <p className="text-center bg-secondary text-light">
                      {p.title} x {p.count} 
                     </p>
                    </>
                 ) : (
                    <>
                     <img src={laptop} style={imageStyle} />
                     <p className="text-center bg-secondary text-light"> 
                      {p.title} x {p.count} 
                     </p>
                    </>
                 )
                 }
               </div>
            </div>
        ))
      } 

      <Link to="/cart">
        <button  onclick ={ () => {
            dispatch({
                type: "SET_VISIBLE",
                payload: false
            })
        }} 
        className="text-center btn btn-raised btn-blocked">
          Go To Cart
        </button>
      </Link>
    </Drawer>
  )
}

export default SideDrawer