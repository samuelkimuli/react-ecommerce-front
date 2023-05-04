import React, {useEffect, useState} from 'react'
import { auth } from "../../firebase";
import {toast} from 'react-toastify'
import { useSelector } from 'react-redux';


const Register = ({history}) => {
    const [email, setEmail] = useState('')
    const {user} = useSelector((state) => ({...state}))

    useEffect(()=>{
      if(user && user.token) history.push('/')
    }, [history,user])

    const handleSubmit = async(e) => {

      e.preventDefault()
      console.log("ENV --->", process.env.REACT_APP_REGISTER_REDIRECT_URL)

      const config = {
        url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
        handleCodeInApp: true
      }

      await auth.sendSignInLinkToEmail(email,config)
      toast.success(`Email has been sent to ${email}. Click on the link to complete registration.`)
      window.localStorage.setItem('emailForRegistration',email)
      setEmail("")

    }
    
    const registerForm = () => (<form onSubmit={handleSubmit}>
           <input 
             type="email" 
             placeholder="please enter your email"
             value={email}
             className="form-control"
             onChange={(e) => setEmail(e.target.value)}
             autoFocus
           />

           <br/>

           <button 
             type="submit" 
             className="btn btn-raised"
           >
            Register
           </button>

        </form>)
   
    return (
        <div className="container">
           <div className="row">
              <div className="col-md-6  offset-md-3">
                <h4>Register</h4>
                {registerForm()}
              </div>
           </div>
        </div>
    )
}

export default Register
