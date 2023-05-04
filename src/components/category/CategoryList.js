import React, {useState, useEffect} from 'react';
import { getCategories } from '../../functions/category';
import { Link } from "react-router-dom";

const CategoryList = () => {
    const [categories, setCategories]  = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
         setLoading(true)
         getCategories().then((c) => {
             setCategories(c.data)
             console.log(categories)
             setLoading(false)
            })

    }, [])

  
  return (
   
    <div className='container'>
      <div className="row">
     
        {loading ? (
            <h4 className='text-center '> Loading...</h4>
            ) : (
              
              categories.map((c) => (
                <div
                  key={c._id}
                  className="col btn btn-outlined-primary btn-lg btn-block btn-raised m-3"
                >
                  <Link to={`/category/${c.slug}`}>{c.name}</Link>
                </div>
              )))
        }
      </div>
    </div>
  ) ;
};

export default CategoryList;
