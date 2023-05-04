import React, {useState, useEffect} from 'react'
import { auth } from "../../firebase";
import {toast} from 'react-toastify'
import { useDispatch } from 'react-redux';
import { createOrUpdateUser } from "../../functions/auth";


const RegisterComplete = ({history}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    let dispatch = useDispatch()

    useEffect(()=>{
        setEmail(window.localStorage.getItem("emailForRegistration"))
    }, [])

    const handleSubmit = async(e) => {
      e.preventDefault()
      //validation
      if(!email || !password){
          toast.error("Email and password are required")
          return
      }

      if(password.length < 6){
          toast.error("The password must be atleast 6 characters long")
          return
      }
      try {
          const result = await auth.signInWithEmailLink(
              email,
              window.location.href
              )
          //console.log("RESULT", result)
          if(result.user.emailVerified){
              //remove email from local storage
              window.localStorage.removeItem('emailForRegistration')
              //get userId token
              let user = auth.currentUser
              await user.updatePassword(password)
              const idTokenResult = await user.getIdTokenResult()

              //update user in redux store
              //console.log("user", user, "idTokenResult", idTokenResult)
              createOrUpdateUser(idTokenResult.token).then(
                (res) => {
                    const{name,email,role,_id} = res.data
                    dispatch({
                        type: "LOGGED_IN_USER",
                        payload: {
                            name: name,
                            email: email,
                            token: idTokenResult.token,
                            role: role,
                            _id: _id,
                        }
                    })
                }
            ).catch((err) => console.log(err))

              //push to next page with history object
              history.push("/")

          }
          
      } catch (err) {
          console.log(err)
          toast.error(err.message)
      }
    
    }
    
    const completeRegisterForm = () => (<form onSubmit={handleSubmit}>
           <input 
             type="email" 
             value={email}
             disabled
             className="form-control"
           />

           <input 
             type="password" 
             value={password}
             placeholder="password"
             className="form-control"
             onChange={(e) => setPassword(e.target.value)}
             autoFocus
           />
           <br />
           <button 
             type="submit" 
             className="btn btn-raised"
           >
            Complete Registration
           </button>

        </form>)
   
    return (
        <div className="container p-5">
           <div className="row">
              <div className="col-md-6  offset-md-3">
                <h4>Register Complete</h4>
                {completeRegisterForm()}
              </div>
           </div>
        </div>
    )
}

export default RegisterComplete
