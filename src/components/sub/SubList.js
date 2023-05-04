import React, {useState, useEffect} from 'react';
import { getSubs } from '../../functions/sub';
import { Link } from "react-router-dom";

const SubList = () => {
    const [subs, setSubs]  = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
         setLoading(true)
         getSubs().then((res) => {
             setSubs(res.data)
             console.log(subs)
             setLoading(false)
            })

    }, [])

  
  return (
   
    <div className='container'>
      <div className="row">
     
        {loading ? (
            <h4 className='text-center '> Loading...</h4>
            ) : (
              
              subs.map((s) => (
                <div
                  key={s._id}
                  className="col btn btn-outlined-primary btn-lg btn-block btn-raised m-3"
                >
                  <Link to={`/sub/${s.slug}`}>{s.name}</Link>
                </div>
              )))
        }
      </div>
    </div>
  ) ;
};

export default SubList;