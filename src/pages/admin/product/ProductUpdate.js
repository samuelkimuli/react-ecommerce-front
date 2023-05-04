import React, { useEffect, useState } from 'react'
import ProductUpdateForm from '../../../components/forms/ProductUpdateForm';
import AdminNav from '../../../components/nava/AdminNav'
import { getProduct, updateProduct } from '../../../functions/product'
import { getCategories, getCategorySubs } from '../../../functions/category'
import FileUpload  from '../../../components/forms/FileUpload'
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";

const initialState = {
    title: "",
    description: "",
    price: "",
    categories: [],
    category: "",
    subs: [],
    shipping: "",
    quantity: "",
    images: [],
    colors: ["Black", "Brown", "Silver", "White", "Blue"],
    brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
    color: "",
    brand: "",
  };

const ProductUpdate = ({match, history}) => {
    const[values, setValues] = useState(initialState)
    const[categories, setCategories] = useState([])
    const[subOptions, setSubOptions] = useState([])
    const[arrayOfSubs,setArrayOfSubs] = useState([])
    const[selectedCategory, setSelectedCategory] = useState('')
    const[loading, setLoading] = useState(false)

    const {slug} = match.params
    const {user} = useSelector((state) => ({...state}))

    useEffect(() => {
        loadProduct()
        loadCategories()
    }, [])

    const loadProduct = () => {
        getProduct(slug).then((p) => {
            console.log('single product', p)
            setValues({...values, ...p.data})
            //single product category subs
            getCategorySubs(p.data.category._id).then((res) => {
                setSubOptions(res.data) // on first load show default values
            })

            let arr = []
            p.data.subs.map((s) => (
                arr.push(s._id)
            ))
            console.log("ARR", arr)
            setArrayOfSubs((prev) => arr)
        })
    }

    const loadCategories = () =>
    getCategories().then((c) => {
      console.log("GET CATEGORIES IN UPDATE PRODUCT", c.data);
      setCategories(c.data);
    });

    const handleSubmit = (e) => {
         e.preventDefault()
         setLoading(true)

         values.subs = arrayOfSubs
         values.category = selectedCategory ? selectedCategory : values.category

         updateProduct(slug, values, user.token)
         .then((res) => {
           setLoading(false)
           toast.success(`${res.data.title} is updated`)
           history.push('/admin/products')
         }).catch((err) => {
           setLoading(false)
           console.log(err)
           toast.success(err.response.data.err)
         })
    }

    const handleChange = (e) => {
        setValues({...values, [e.target.name]: e.target.values})
         // console.log(e.target.name, " ----- ", e.target.value);
    }

    const handleCategoryChange = (e) => {
        e.preventDefault();
        console.log("CLICKED CATEGORY", e.target.value);
        setValues({ ...values, subs: [] });

        setSelectedCategory(e.target.value)

        getCategorySubs(e.target.value).then((res) => {
          console.log("SUB OPTIONS ON CATGORY CLICK", res);
          setSubOptions(res.data);
        });

        console.log("Existing category values.category", values.category)
        
        // if user clicks back to the original category
       // show its sub categories in default
       if( values.category._id === e.target.value) {
           loadProduct()
       }
       // clear old sub category ids
        setArrayOfSubs([])
      };
  
    return (
        <div className="container-fluid">
           <div className="row">
              <div className="col-md-2">
                 <AdminNav/>
              </div>

              <div className="col-md-10">
                {loading ? (
                 <LoadingOutlined className="text-danger h1" />
                ) : (
                  <h4>Product update</h4>
                )}

                 {/* {JSON.stringify(values)} */} 

                 <div className="p-3">
                   <FileUpload
                     values={values}
                     setValues={setValues}
                     setLoading={setLoading}
                   />
                  </div>

                 
                 <ProductUpdateForm 
                  values={values}
                  setValues={setValues}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  handleCategoryChange={handleCategoryChange}
                  categories={categories}
                  subOptions={subOptions}
                  arrayOfSubs={arrayOfSubs}
                  setArrayOfSubs={setArrayOfSubs}
                  selectedCategory={selectedCategory}
                 />
              </div>
           </div>
            
        </div>
    )
}

export default ProductUpdate
