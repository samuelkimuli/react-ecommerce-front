import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import AdminNav from '../../../components/nava/AdminNav'
import {createProduct} from "../../../functions/product"
import {getCategories, getCategorySubs} from "../../../functions/category"
import {toast} from 'react-toastify'
import ProductCreateForm from '../../../components/forms/ProductCreateForm'
import FileUpload from '../../../components/forms/FileUpload'
import { LoadingOutlined } from "@ant-design/icons";

const initialState = {
    title: "",
    description: "",
    price: "",
    categories: "",
    category: "",
    subs: [],
    shipping: "",
    quantity: "",
    images: [],
    colors: ["Black", "Brown", "Silver", "White", "Blue"],
    brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "Asus"],
    color: "",
    brand: "",
}


const ProductCreate = () => {
    const [values, setValues] = useState(initialState)
    const [subOptions, setSubOptions] = useState([])
    const [showSub, setShowSub] = useState(false)
    const [loading,setLoading] = useState(false)
    

    const {user} = useSelector((state) => ({...state}))

    useEffect(()=>{
      loadCategories()
     
   }, [])

   const loadCategories = () => {
     getCategories().then((c) => setValues({...values, categories: c.data}))
   }

    const handleSubmit = (e) => {
        e.preventDefault()
        createProduct(values, user.token)
        .then((res) => {
            console.log(res)
            window.alert(`"${res.data.title}" is created`)
            window.location.reload()
        })
        .catch((err) => {
            console.log(err)
            //if(err.response.status === 400) toast.error(err.response.data)
            toast.error(err.response.data.err)
        })
    }

    const handleChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value })
        //console.log(e.target.name, "<<<<<>>>>>>", e.target.value)
    }
    
    const handleCategoryChange = (e) => {
      console.log("CLICKED CATEGORY", e.target.value)
      setValues({...values, category: e.target.value })
      getCategorySubs(e.target.value).then((res) => {
        console.log('SUB OPTIONS ON CATEGORY CLICK', res)
        setSubOptions(res.data)
      })

      setShowSub(true)
    }

    return (
        <div className="container-fluid">
          <div className="row">
             <div className="col-md-2">
               <AdminNav />
             </div>

             <div className="col-md-10">
              {loading ? (
                <LoadingOutlined className="text-danger h1"/>
              ) : (
                <h4>product create</h4>
              )}
              
               <hr/>

              {/*{JSON.stringify(values.images)}*/}
              
               <div>
                <FileUpload 
                 values={values} 
                 setValues={setValues} 
                 setLoading={setLoading}
                />
               </div>

              <ProductCreateForm 
               values={values} 
               handleChange={handleChange} 
               handleSubmit={handleSubmit}
               handleCategoryChange={handleCategoryChange}
               showSub={showSub}
               subOptions={subOptions}
               setValues={setValues}
              />
             </div>
          </div>
        </div>
    )
}

export default ProductCreate
