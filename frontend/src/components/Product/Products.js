import React, { Fragment, useEffect, useState } from 'react';
import './Products.css';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, getProduct } from '../../actions/productAction';
import Loader from '../layout/Loader/Loader';
import Product from '../Home/Product';
import Pagination from 'react-js-pagination'
import Slider from "@material-ui/core/Slider"
import Typography  from '@material-ui/core/Typography';


const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhone"
];

const Products = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1)
  const [price, setPrice] = useState([0, 25000])
  const [category, setCategory] = useState("");

  const [ratings, setRatings] = useState(0)

  const {products,
        loading,
        error,
        productsCount,
        resulPerPage,
        filteredProductsCount} = useSelector((state) => state.products);

  const keyword = useParams;
  //const keyword  = match.params.keyword

 const setCurrentPageNo = (e) => {
  setCurrentPage(e)
 }

 const priceHandler = (event, newPrice) => {
    setPrice(newPrice)
 }

  useEffect(() => {
      dispatch(getProduct(keyword, currentPage, price, category))
  },[dispatch, keyword, currentPage, price, category])

  let count = filteredProductsCount

  return (
    <Fragment>
      {loading ? (
        <Loader/>
      ) : (
        <Fragment>
          <h2 className='productsHeading'>Products</h2>
          <div className='products'>
            {products && products.map((product) => (
              <Product key={product._id} product = {product}/>
            ))}
          </div>
          <div className='filterBox'> 
              <Typography>Price</Typography>
              <Slider
               value={price}
               onChange={priceHandler}
               valueLabelDisplay='auto'
               aria-labelledby='range-slider'
               min={0}
               max={25000}
              />

              <Typography>Categories</Typography>
              <ul className='categoryBox'>
                {categories.map((category) => (
                  <li 
                    className='category-link'
                    key={category}
                    onClick={() => setCategory(category)}
                  >
                    {category}

                  </li>
                ))}
              </ul>

              <fieldset>
                <Typography component="legend">Ratings Above</Typography>
                <Slider
                  value={ratings}
                  onChange={(e, newRating) => {
                    setRatings(newRating);
                  }}
                  aria-labelledby='continuous-slider'
                  min={0}
                  max={5}
                  valueLabelDisplay='auto'
                />
              </fieldset>



          </div>

         {resulPerPage < count && (
           <div className='paginationBox'>
           <Pagination
            activePage={currentPage}
            itemsCountPerPage={resulPerPage}
            totalItemsCount={productsCount}
            onChange={setCurrentPageNo}
            nextPageText="Next"
            prevPageText="Prev"
            firstPageText="1st"
            lastPageText="Last"
            itemClass='page-item'
            linkClass='page-link'
            activeClass='pageItemActive'
            activeLinkClass='pageLinkActive'
           /> 

         </div>
         )}
        </Fragment>
      )}
    </Fragment>
  )
}

export default Products