import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { applyCoupon, emptyUserCart, getuserCart, saveUserAddress, createCashOrderForUser } from '../functions/user'
import { toast } from "react-toastify";
import ReactQuill from 'react-quill'
import "react-quill/dist/quill.snow.css";


const Checkout = ({history}) => {
  
  const[products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [address, setAddress] = useState('')
  const [coupon, setCoupon] = useState('')
  const [addressSaved, setAddressSaved] = useState(false)
  const [totalAfterDiscount,setTotalAfterDiscount] = useState(0)
  const [discountError, setDiscountError] = useState('')

  const dispatch = useDispatch()
  const {user, COD} = useSelector((state) => ({...state}))
  const {couponTrueOrFalse} = useSelector((state) => state.coupon)

  useEffect(() => {
    getuserCart(user.token).then(
      (res) => {
        console.log('cart save res', JSON.stringify(res.data))
        setProducts(res.data.products)
        setTotal(res.data.cartTotal)
      }
    )
  }, [user.token])

  const emptyCart = () => {
    //remove cart from local storage
    if(typeof window != 'undefined'){
      localStorage.removeItem('cart')
    }

    //remove cart from redux
    dispatch({
      type: 'ADD_TO_CART',
      payload: [],
    })

    //remove cart from backend
    emptyUserCart(user.token).then(
      (res) => {
        setProducts([])
        setTotal(0)
        setTotalAfterDiscount(0)
        setCoupon('')
        toast.success('You have emptied the cart, please continue shopping!')
      }
    )
  }

  const saveAddressToDb = () => {
    saveUserAddress(user.token, address).then((res) => {
      if(res.data.ok){
        setAddressSaved(true)
        toast.success('The address has been successfully saved!')
      }
    })
  }

  const applyDiscountCoupon = () => {
    console.log('Apply coupon in the backend', coupon)
    applyCoupon(user.token,coupon).then((res) => {
      console.log('RES on coupon applied', res.data)
      if (res.data) {
        setTotalAfterDiscount(res.data)

        // update redux coupon
        dispatch({
          type: "COUPON_APPLIED",
          payload: true,
        })
        
      }

      //error
      if(res.data.err){
        setDiscountError(res.data.err)
        //update redux coupon

        dispatch({
          type: 'COUPON_APPLIED',
          payload: false,
        })
      }
    })
  }

  const showAddress = () => (
    <>
    <ReactQuill theme='snow' value={address} onChange={setAddress}/>
    <button className='btn btn-primary mt-2' onClick={saveAddressToDb}>Save</button>
    
    </>
  )
     
  

  const showProductSummary = () => 
    
    products.map((p,i) => (
      <div key={i}>
        <p>
          {p.product.title} ({p.color}) x {p.count} = {''}
          {p.product.price * p.count}
        </p>
      </div>
     ));

  const showApplyCoupon = () => (
    <>
     <input 
       type="text" 
       onChange={(e) => {
        setCoupon(e.target.value)
        setDiscountError('')
       }
        
        }
       
       className="form-control" 
       value={coupon}
     />
     <button 
      className="btn btn-primary mt-2"
      onClick={applyDiscountCoupon}
     >
        Apply
     </button>
    </>
  )

  const createCashOrder = () => {
    createCashOrderForUser(user.token, COD, couponTrueOrFalse).then(
      (res) => {
         console.log('USER CASH ORDER CREATED RES', res )
         if(res.data.ok){
            //empty local stoarge
               if(typeof window != 'undefined'){
                localStorage.removeItem('cart')
              }

            // empty redux cart
               dispatch({
                type: "ADD_TO_CART",
                payload: [],
               })

            // empty redux coupon
               dispatch({
                type: "COUPON_APPLIED",
                payload: false,
               })

            // empty redux COD
               dispatch({
                type: "COD",
                payload: false,
               })

            //emtpy cart from backend
            emptyUserCart(user.token)

            // redirect
            setTimeout(() => {
               history.push("/user/history")
            }, 1000) 
         }
      }
    )
  }
    

  return (
    <div className='row'>
       <div className='col-md-6'>
          <h4>Delivery address</h4>
          <br/>
          <br/>
           {showAddress()}
          <hr/>
          <h4>Got Coupon?</h4>
          <br/>
          {showApplyCoupon()}
          <br/>
          {discountError && <p className="bg-danger p-2">{discountError}</p>}
       </div>

       <div className='col-md-6'>
         <h4>Order Summary</h4>
         <hr/>
         <p>Products {products.length}</p>
         <hr/>
         {showProductSummary()}

         <hr/>
         <p>Cart Total: {total}</p>

          {totalAfterDiscount > 0 && ( 
            <p className="bg-success" p-2>
             Discount applied: Total payable: ${totalAfterDiscount}
            </p>
          )}

         <div className="row">
           <div className="col-md-6">
              {COD ? (
                <button 
                className="btn btn-primary" 
                onClick={createCashOrder}
                disabled={!addressSaved || !products.length}
             >
                Place order
             </button>
              ) : (
                <button 
                className="btn btn-primary" 
                onClick={() => history.push("/payment")}
                disabled={!addressSaved || !products.length}
             >
                Place order
             </button>
              )}
           </div> 
           <div className="col-md-6">
             <button
                className="btn btn-primary"
                disabled={!products.length}
                onClick={emptyCart}
              >

              Empty cart

             </button>
           </div>
         </div>
       </div>
    </div>
  )
}

export default Checkout