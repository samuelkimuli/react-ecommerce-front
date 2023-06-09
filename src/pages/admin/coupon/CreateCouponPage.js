import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import AdminNav from "../../../components/nava/AdminNav";
import DatePicker from "react-datepicker";
import { createCoupon, getCoupons, removeCoupon } from "../../../functions/coupon";
import { DeleteOutlined } from "@ant-design/icons";
import('react-datepicker/dist/react-datepicker.css')


const CreateCouponPage = () => {

  const[name, setName] = useState('')
  const[expiry, setExpiry] = useState('')
  const[discount, setDiscount] = useState('')
  const[loading, setLoading] = useState('')
  const[coupons, setCoupons] = useState([])

  //redux
  const{user} = useSelector((state) => ({...state}))

  useEffect(() => {
    loadAllCoupons()
  }, [])

  const loadAllCoupons = () => {
    getCoupons().then((res) => setCoupons(res.data))
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    //console.table(name,expiry,discount)
    setLoading(true)
    createCoupon({name,expiry,discount}, user.token).then(
      (res) => {
        //console.log('res from server', res.data.name)
        setLoading(false)
        setName('')
        setExpiry('')
        setDiscount('')
        toast.success(`${res.data.name} has been created`)
        loadAllCoupons()
      }
    ).catch(err => console.log('create coupon error', err))
    
  }

  //remove a created coupon function
  const handleRemove =(couponId) => {
      if (window.confirm("Delete?")) {
         setLoading(true)
         removeCoupon(couponId, user.token).then(
           (res) => {
              getCoupons().then((res) => setCoupons(res.data))
              setLoading(false)
              toast.error(`Coupon "${res.data.name}" deleted`)
           }
         ).catch(err => console.log(err))
      }
  }

  return (
    <div className="container-fluid">
    <div className="row">
      <div className="col-md-2">
       <AdminNav />
      </div>

      <div className="col-md-10">
        {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Coupon</h4>}

        <form onSubmit={handleSubmit}>
           <div className="form-group">
             <label className="text-muted">Name</label>
             <input
                type='text'
                className="form-control"
                onChange={ (e) => setName(e.target.value)}
                value={name}
                autoFocus
                required
             />
           </div>

           <div className="form-group">
              <label className="text-muted">Discount %</label>
              <input
                className="form-control"
                type='text'
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                required
              />
           </div>

           <div className="form-group">
             <label className="text-muted">Expiry</label>
             <br/>
             <DatePicker
               className="form-control"
               selected={expiry}
               onChange={(date) => setExpiry(date)}
               value={expiry}
               required 
             />
           </div>

           <button className="btn btn-outline-primary">Save</button>


        </form>

        <br/>

        <h4>{coupons.length} Coupons</h4>

        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Expiry</th>
              <th scope="col">Discount</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody>
            {coupons.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{new Date(c.expiry).toLocaleDateString()}</td>
                <td>{c.discount}%</td>
                <td>
                <DeleteOutlined
                  onClick={() => handleRemove(c._id)}
                  className="text-danger pointer"
                />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
   </div>
   </div>
    
    
  )
}

export default CreateCouponPage