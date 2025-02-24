import React, { Fragment, useEffect } from 'react'
import {CgMouse} from "react-icons/cg"
import "./Home.css"
import Product from "./Product.js"
import MetaData from '../layout/MetaData.js'
import {clearErrors, getProduct} from '../../actions/productAction.js'
import {useSelector, useDispatch} from "react-redux"
import Loader from '../layout/Loader/Loader.js'
//  import {useAlert} from "react-alert"

// First try to create products
// const product = {
//   name: "white Tshirt",
//   images:[{url: "https://i.ibb.co/DRST11n/1.webp"}],
//   price: "$200",
//   _id: "abishek"

// }


const Home = () => {
  //const alert = useAlert()
  const dispatch = useDispatch();
  const {loading, error, products, productsCount} = useSelector(
    (state) => state.products
  )

  useEffect(() => {
    // if(error){
    //   alert.error(error);
    //   dispatch(clearErrors())
    // }
    dispatch(getProduct());
  },[dispatch,]) // <-- error, alert

  return (
  <Fragment>
    {loading ? (
      <Loader/>
    ) : (
    <Fragment>
    <MetaData title="ECOMMERCE" />
    <div className='banner'>
        <p>Welcome to Ecommerce</p>
        <h1>FIND AMAZING PRODUCTS BELOW</h1>
        <a href='#container'>
            <button>
               Scroll <CgMouse/>
            </button>
        </a>

    </div>
    <h2 className='homeHeading'>Feature Products</h2>
    <div className='container' id='container'>
      {products && products.map((product) => <Product product ={product}/>)}

    </div>


  </Fragment>)}
  </Fragment>
  );
}

export default Home