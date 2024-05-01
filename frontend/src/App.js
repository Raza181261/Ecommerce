
import './App.css';
import Header from "./components/layout/Header/Header.js"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Webfont from "webfontloader";
import React from 'react';
import Footer from "./components/layout/Footer/Footer.js"
import Home from "./components/Home/Home.js"
import ProductDetails from "./components/Product/ProductDetails.js"
import Products from './components/Product/Products.js';
import Search from './components/Product/Search.js'


function App() {

  React.useEffect(() => {
       Webfont.load({
        google: {
          families:["Roboto", "Droid Sans", "Chilanka"]
        }
       })
  },[])
  return (
  <Router>
    <Header/>
    <Routes>

    <Route extact path='/' Component={Home}/>
    <Route extact path='/product/:id' Component={ProductDetails}/>
    <Route extact path='/products' Component={Products}/>
    {/* <Route  path='/products/:keyword' Component={Products}/> */}
    <Route extact path='/search' Component={Search}/>

    
    </Routes>

    <Footer/>
    
  </Router>
  )
 
    
   
  
}

export default App;
