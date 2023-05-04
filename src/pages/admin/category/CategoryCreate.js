import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import AdminNav from '../../../components/nava/AdminNav'
import {createCategory, 
  getCategories, 
  removeCategory} from "../../../functions/category"
import {toast} from 'react-toastify'
import{DeleteOutlined, EditOutlined} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import CategoryForm from '../../../components/forms/CategoryForm'
import LocalSearch from '../../../components/forms/LocalSearch'

const CategoryCreate = () =>   {
    const {user} = useSelector((state) => ({...state}))
    const[name,setName] = useState('')
    const[loading,setLoading] = useState(false)
    const[categories,setCategories] = useState([])
    //searh and filter state 1
    const[keyword, setKeyword] = useState('')


    useEffect(()=>{
       loadCategories()
      
    }, [])

    const loadCategories = () => {
      getCategories().then((c) => setCategories(c.data))
    }
    

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(name)
        setLoading(true)
       
        //console.log(user.token)
        createCategory({name}, user.token).then((res) => {
            console.log(res)
            setLoading(false)
            setName('')
            toast.success(`${res.data.name} is created`)
            loadCategories()
            
        }).catch((err) => {
          console.log(err)
          setLoading(false)
          if(err.response.status === 400) toast.error(err.response.data)
        }) 
    }

    const handleRemove = (slug) => {
       if(window.confirm("Delete?")){
         removeCategory(slug,user.token).then((res) => {
           setLoading(false)
           toast.error(`${res.data.name} has been deleted`)
           loadCategories()
         }).catch((err) => {
           if(err.response.status === 400) {
             setLoading(false)
             toast.error(err.response.data)
           }
         })
       }
       
    }


    const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword)

  
    return(
    <div className="container-fluid">
       <div className="row">
         <div className="col-md-2">
           <AdminNav />
         </div>
         <div className="col">
         {loading ?(
           <h4 className="text-danger">Loading...</h4>
           ): (
             <h4>create Category</h4>
             )
         }
         
         <CategoryForm 
         handleSubmit={handleSubmit} 
         name={name} 
         setName={setName}
         />

        <LocalSearch keyword={keyword} setKeyword={setKeyword}/>
        
         {categories.filter(searched(keyword)).map((c) => (
           <div
            className="alert alert-secondary"
            key={c._id}
           >
            {c.name}{" "} 
            <span 
             className="btn btn-sm float-right"
             onClick={() => handleRemove(c.slug)}
            >
              <DeleteOutlined className="text-danger"/
             >
            </span>
            <Link
             to={`/admin/category/${c.slug}`}
            >
             <span className="btn btn-sm float-right">
                <EditOutlined className="text-warning"/>
             </span>

            </Link>
           </div>
         ))}
         </div>
       </div>  
    </div>
)
    
}

export default CategoryCreate
