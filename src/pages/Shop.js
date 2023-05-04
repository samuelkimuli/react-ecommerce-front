/* eslint-disable react-hooks/exhaustive-deps */
//Downgraded mongoose version previous was 6.0.11
import React, { useEffect, useState } from 'react'
import {fetchProductsByFilter, getProductsByCount} from '../functions/product'
import ProductCard from '../components/cards/ProductCard'
import { getCategories } from '../functions/category'
import {getSubs} from '../functions/sub'
import { useSelector,useDispatch } from 'react-redux'
import {Menu, Slider, Checkbox, Radio} from 'antd'
import { 
  DollarOutlined, 
  DownSquareOutlined, 
  StarOutlined ,
} from '@ant-design/icons'
import Star from '../components/forms/Star'

const {SubMenu, ItemGroup} = Menu

const Shop = () => {

    const[products, setProducts] = useState([])
    const[loading,setLoading] = useState(false)
    const[price, setPrice] = useState([0, 0])
    const[ok, setOk] = useState(false)
    const[categories, setCategories] = useState([])
    const[categoryIds, setCategoryIds] = useState([])
    const[star, setStar] = useState('')
    const[subs, setSubs] = useState([])
    const[sub, setSub] = useState("")
    const[brands, setBrands] = useState([
      "Apple",
      "Samsung",
      "Microsoft",
      "Lenovo",
      "ASUS",
    ])

    const [brand, setBrand] = useState("")
    const [colors, setColors] = useState([
      "Black",
      "Brown",
      "Silver",
      "White",
      "Blue",
    ])
    const [color, setColor] = useState("")
    const [shipping, setShipping] = useState("")

    let dispatch = useDispatch()
    let {search} = useSelector((state) => ({ ...state} ))
    const {text} = search

    useEffect(() => {
        loadAllProducts()
        //fetch categories
        getCategories().then( res => setCategories(res.data) )

        //fetch sub categories
        getSubs().then((res) => setSubs(res.data))
    }, [])

    const fetchProducts = (arg) => {
      fetchProductsByFilter(arg).then((res) => {
        console.log(res)
        setProducts(res.data)
      })
    }


    //1.load products by default on page load
    const loadAllProducts = () => {
        getProductsByCount(12).then((p) => {
            console.log(p)
            setProducts(p.data)
            setLoading(false)
        })
    }

    //2. load products on user search input
    useEffect(() => {
      //console.log('load products on user search input', text)
      const delayed = setTimeout(() => {
        fetchProducts({query:text})

        if(!text){
          loadAllProducts()
        }
      }, 300)

      return () => clearTimeout(delayed)
      
    
    }, [ text])

   

    //3.load products based on price range
    useEffect(() => {
      console.log("ok to request")
      fetchProducts({ price });
    }, [ok]);
   

   const handleSlider = (value) => {
      dispatch({
        type:"SEARCH_QUERY",
        payload: {text: ""},
      })
      setCategoryIds([])
      setPrice(value)
      setStar("");
      setSub("")
      setBrand("")
      setColor("")
      setShipping("")
      setTimeout(() => {
        setOk(!ok)
      }, 300);
    } 

    //4. Load products based on categories
    // show categories in a checkbox list 
    // const showCategories = () => {
    //   categories.map((c) =>  (
    //     <div key={c._id}>
    //       <Checkbox
    //        className='pb-2 pl-4 pr-4'
    //        value={c._id}
    //        name='category'
    //       >

    //       {c.name}

    //       </Checkbox>
    //     </div>))
    // }
    // handle check for categories
    const handleCheck = e => {
      dispatch({
        type:"SEARCH_QUERY",
        payload: {text: ""},
      })
      setPrice([0, 0])
      setStar("");
      setSub("");
      setBrand("")
      setColor("")
      setShipping("")
    //console.log(e.target.value)
     let inTheState = [...categoryIds]
     let justChecked = e.target.value
     let foundInTheState = inTheState.indexOf(justChecked)  // index or -1

     if(foundInTheState === -1){
       inTheState.push(justChecked)

     } else{
       inTheState.splice(foundInTheState, 1)
     }

     setCategoryIds(inTheState)
     //console.log(inTheState)
     fetchProducts({category: inTheState})
    }

    // 5. show products by star rating

    const handleStarClick = (num) => {
      //console.log(num)
      dispatch({
        type:"SEARCH_QUERY",
        payload: { text: "" },
      })
      setPrice([0, 0])
      setCategoryIds([])
      setStar(num)
      setSub("");
      setBrand("")
      setColor("")
      setShipping("")
      fetchProducts({ stars: num })
    }
    // const showStars = () => (
    //   <div className='pr-4 pl-4 pb-2'>
    //     <Star  starClick={handleStarClick} numberOfStars={5}/>
    //     <Star  starClick={handleStarClick} numberOfStars={4}/>
    //     <Star  starClick={handleStarClick} numberOfStars={3}/>
    //     <Star  starClick={handleStarClick} numberOfStars={2}/>
    //     <Star  starClick={handleStarClick} numberOfStars={1}/>
    //   </div>
    // )

   //6. show products by sub category
    
     const handleSub = (sub) => {
       //console.log("SUB", sub)
       setSub(sub)
       dispatch({
        type: "SEARCH_QUERY",
        payload: { text: "" },
      });
      setPrice([0, 0]);
      setCategoryIds([]);
      setStar("");
      setBrand("")
      setColor("")
      setShipping("")
      fetchProducts({ sub })

     }

     // 7. show products based on brand name
     const handleBrand = (e) => {
      setSub("")
      dispatch({
        type: "SEARCH_QUERY",
        payload: {text: ""},
      })
      setPrice([0, 0])
      setCategoryIds([])
      setStar("")
      setColor("")
      setShipping("")
      setBrand(e.target.value)
      fetchProducts({ brand : e.target.value })
     }

     //8. show products based on color
     const handleColor = (e) => {
      setSub("")
      dispatch({
        type: "SEARCH_QUERY",
        payload: { text: ""},
      })
      setPrice([0, 0])
      setCategoryIds([])
      setStar("")
      setBrand("")
      setShipping("")
      setColor(e.target.value)
      fetchProducts({ color: e.target.value })
     }

     //9. show products based on shipping yes/no
     const showShipping = () => (
      <>
        <Checkbox
          className='pb-2 pl-4 pr-4'
          onChange={handleShippingChange}
          value="Yes"
          checked={shipping === "Yes"}
        >
          Yes
        </Checkbox> 

        <Checkbox
          className='pb-2 pl-4 pr-4'
          onChange={handleShippingChange}
          value="No"
          checked={shipping === "No"}
        >
         No
        </Checkbox>
      </>
      )

    const handleShippingChange = (e) => {
      setSub("")
      dispatch({
        type: "SEARCH_QUERY",
        payload: { text: ""},
      })
      setPrice([0,0])
      setCategoryIds([])
      setStar("")
      setBrand("")
      setColor("")
      setShipping(e.target.value)
      fetchProducts({ shipping: e.target.value })
    }

  return (
    
    <div className='container-fluid'>
    
      <div className="row">
    
        <div className="col-md-3 pt-2" >
          <h4>search/filter</h4> 
          <hr/>
      
           <Menu defaultOpenKeys={['1','2', '3', '4', '5', '6', '7']}   mode='inline'>
           {/* Price */}
            <SubMenu key='1' title={
              <span className='h6'>
                <DollarOutlined/> Price
              </span>}>
             <div>
               <Slider 
                  className='ml-4 mr-4' 
                  tipFormatter={(v) => `$${v}`} 
                  range 
                  value={price} 
                  onChange={handleSlider}
                  max='4999'
               />
             </div>
            </SubMenu>
           
            {/* Categories*/}
            <SubMenu key='2' title={
              <span className='h6'>
                <DownSquareOutlined/> Categories
              </span>}>
             <div style={{marginTop: "-10px"}}>
               { categories.map((c) =>  (
                <div key={c._id}>
                  <Checkbox
                   className='pb-2 pl-4 pr-4'
                   value={c._id}
                   name='category'
                   onChange={handleCheck}
                   checked={categoryIds.includes(c._id)}
                  >
        
                  {c.name}
        
                  </Checkbox>
                </div>))
               }
             </div>
            </SubMenu>

            {/* Stars */}
            <SubMenu key='3' title={
              <span className='h6'>
                <StarOutlined/> Rating
              </span>}>
             <div style={{marginTop: "-10px"}}>
               { <div className='pr-4 pl-4 pb-2'>
               <Star  starClick={handleStarClick} numberOfStars={5}/>
               <Star  starClick={handleStarClick} numberOfStars={4}/>
               <Star  starClick={handleStarClick} numberOfStars={3}/>
               <Star  starClick={handleStarClick} numberOfStars={2}/>
               <Star  starClick={handleStarClick} numberOfStars={1}/>
             </div>}
             </div>
            </SubMenu>

          

          {/* sub category*/}
          
          <SubMenu 
            key='4' 
            title={
            <span className='h6'>
              <DownSquareOutlined/> Sub Categories
            </span>
            }
          >
           <div style={{marginTop: "-10px"}}>
             { subs.map((s) => (
              <div
                key={s._id}
                onClick={() => handleSub(s)}
                className="p-1 m-1 badge badge-secondary"
                style={{ cursor: "pointer" }}
              >
                {s.name}
              </div>
            ))}
           </div>
          </SubMenu>

          {/* brands */}
          <SubMenu
            key="5"
            title={
              <span className="h6">
                <DownSquareOutlined /> Brands
              </span>
             }
          >
            <div style={{ maringTop: "-10px" }} className="pr-5">
              {brands.map((b) => (
                <Radio
                  value={b}
                  name={b}
                  checked={b === brand}
                  onChange={handleBrand}
                  className="pb-1 pl1-4 pr-4"
                >{b}</Radio>
              ))}
            </div>
          </SubMenu>

           {/* colors */}
           <SubMenu
               key="6"
               title={
                 <span className="h6">
                   <DownSquareOutlined /> Colors
                 </span>
                }
           >
            <div style={{ maringTop: "-10px" }} className="pr-5">
             {colors.map((c) => (
                 <Radio
                    value={c}
                    name={c}
                    checked={c === color}
                    onChange={handleColor}
                    className="pb-1 pl-4 pr-4"
                 > 
                   {c}
                 </Radio>
             ))}
            </div>
           </SubMenu>

           {/* shipping */}
           <SubMenu
            key="7"
            title={
             <span className="h6">
               <DownSquareOutlined /> Shipping
             </span>
             }
           >
            <div style={{ maringTop: "-10px" }} className="pr-5">
             {showShipping()}
            </div>
           </SubMenu>
         
         </Menu> 
        </div>

        <div className="col-md-9 pt-3">
           {loading ? (
             <h4 className="text-danger">Loading...</h4>
            ) : (
            <h4 className="text-danger">Products</h4>
            )
           }
           
           {products.length < 1 && <p>No Products Found</p>}
           {console.log("products---->",products)}
            <div className="row" pb-5>
              {products.map((p) => (
                <div key={p._id} className='col-md-4 mt-3'>
                  <ProductCard product={p}/> 
                </div>))
              }
            </div>
        </div>
      
      </div>
    
    </div>
    
  )
}

export default Shop