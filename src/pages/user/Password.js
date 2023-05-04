import React, { useState } from 'react'
import UserNav from '../../components/nava/UserNav'
import { auth } from '../../firebase'
import { toast } from "react-toastify";

const Password =() => {
    const[password,setPassword] = useState("")
    const[loading,setLoading] = useState(false)

    const handleSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)
        console.log(password)

        await auth.currentUser.updatePassword(password).then(() => {
          setLoading(false)
          setPassword("")
          toast.success("password updated")

        }).catch((err) => {
          setLoading(false)
          toast.error(err.message)
        })
    }

    const passwordUpdateForm = () => <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Your Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter Your Password"
          onChange={e => setPassword(e.target.value)}
          value={password}
          disabled={loading}
        />
        <button 
        className="btn btn-primary"
        disabled={password.length < 6 || !password || loading}
        >
        Submit
        </button>
      </div>
    </form>
    return(
        <div className="container-fluid">
           <div className="row">
             <div className="col-md-2">
               <UserNav/>
             </div>
             <div className="col">
               {loading ? (<h4 className="text-danger">Loading...</h4>) : (<h4>Password Update</h4>)}
               
               {passwordUpdateForm()}
             </div>
           </div>  
        </div>
    )

}

export default Password